import subprocess
import platform
import time
import os
import asyncio
import json
from pydantic import BaseModel
from typing import List, Dict
from subprocess import Popen

class VM(BaseModel):
    name: str
    ip: str
    path: str
    status: str

class Config(BaseModel):
    vmware_path: str
    machines: List[Dict]

class VirtualMachine:

    config_file = "config.json"

    def __init__(self, name, path, vmware_path, ip):

        self.name = name
        self.path = path
        self.vmware_path = vmware_path
        self.start_command = f'"{self.vmware_path}vmrun" start "{self.path}" nogui'
        self.stop_command = f'"{self.vmware_path}vmrun" stop "{self.path}"'
        self.ip = ip
        self.config = Config(**json.load(open("config.json")))
        self.status = "Offline"

    def store(self):
        print(type(self.status), 'ss')
        self.config.machines.append(dict(VM(name=self.name,ip=self.ip,path=self.path,status=self.status)))
        self.update_config()

    def update_config(self):
        data = dict(self.config)
        fw = open(VirtualMachine.config_file, "w")
        print(data)
        json.dump(data, fw)
        print("Config data updated")

    async def start(self):
        # result = os.popen(self.start_command).read()
        print("Trying to start vm")
        result = subprocess.run(self.start_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        self.status = "Starting"
        if result.returncode == 0:
            print("VM started, pinging host")
            await self.check_connection()
            self.status = "Online"
            print("VM is online")
            self.store()
        else:
            # Print error message if the command failed
            print(f"Error code: {result.returncode}")
            print(f"Error: {result.stderr.strip()}")

    async def check_connection(self):
        is_online = False 
        while not is_online:
            await asyncio.sleep(1)
            is_online = await self.ping_host()
            

    async def ping_host(self):
        try:
            # result = subprocess.run(['ping', self.ip], capture_output=True, text=True, check=True)
            # result = Popen(['ping',self.ip])
            proc = await asyncio.create_subprocess_exec('ping',self.ip, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
            stdout, stderr = await proc.communicate()
            print(stdout)
            print(stderr)
            if b"timed out" not in stdout and b"host unreachable" not in stdout: return True 
            return False
        except subprocess.CalledProcessError as e:
            print(f"Error: {e}")
            print(f"Error: {e.stderr.strip()}")
            return False

    def stop(self):
        print("trying to stop vm")
        result = subprocess.run(self.stop_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        
        if result.returncode == 0:
            print("VM stoped")
            self.status = "Offline"
        else:
            # Print error message if the command failed
            print(f"Error code: {result.returncode}")
            print(f"Error: {result.stderr.strip()}")

    def is_file(self):
        pass