import subprocess
import platform
import time
import os
import asyncio
import json
from pydantic import BaseModel, ValidationError
from typing import List, Dict
from subprocess import Popen
from pythonping import ping

class VM(BaseModel):
    name: str
    ip: str
    path: str
    status: str

class Config(BaseModel):
    vmware_path: str
    machines: Dict

class VirtualMachine:

    config_file = "config.json"
    def __init__(self, name, path, vmware_path, ip):

        self.name = name
        self.path = path
        self.vmware_path = vmware_path
        self.ip = ip
        self.fail_reason = None

        try:
            self.config = Config(**json.load(open("config.json")))
        except ValidationError as e:
            print(e)
        self.status = "Offline"
        self.store()

    def start_command(self):
        return f'"{self.vmware_path}vmrun" start "{self.path}" nogui'
    
    def stop_command(self):
        return f'"{self.vmware_path}vmrun" stop "{self.path}"'

    def store(self):
        self.config.machines[self.name] = dict(VM(name=self.name,ip=self.ip,path=self.path,status=self.status))
        self.update_config()

    def update_config(self):
        data = dict(self.config)
        fw = open(VirtualMachine.config_file, "w")
        json.dump(data, fw)
        print("Config data updated")

    async def start(self):
        # result = os.popen(self.start_command).read()
        if await self.ping_host():
            print("vm is already running")
            return
        print("Trying to start vm")
        
        if not self.is_file(self.vmware_path):
            self.status = "Failed"
            self.fail_reason = "VMware folder does not exists"
            print("VMware folder does not exists")
            return
        if not self.is_file(self.path):
            self.status = "Failed"
            self.fail_reason = "VM file path does not exists"
            print("VM file path does not exist")
            return
        
        result = subprocess.run(self.start_command(), stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        self.status = "Starting"
        if result.returncode == 0:
            print("VM started, pinging host")
            await self.check_connection()
            self.status = "Online"
            print("VM is online")
            self.store()
        else:
            print(f"Error code: {result.returncode}")
            print(f"Error: {result.stderr.strip()}")
            self.status = "Failed"
            if result.returncode == 4294967295:
                self.fail_reason = "File is being used by another process"
                return
            if "is not recognized as an internal or external command" in result.stderr.strip():
                self.fail_reason = "Invalid vmrun path"
                return
            self.fail_reason = result.stderr.strip()

    async def check_connection(self):
        is_online = False 
        while not is_online:
            await asyncio.sleep(1)
            is_online = await self.ping_host()
            

    async def ping_host(self):
        try:
            # proc = await asyncio.create_subprocess_exec('ping',self.ip, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
            # stdout, stderr = await proc.communicate()
            stdout = str(ping(self.ip,verbose=True,count=1))
            
            if "timed out" not in stdout and "host unreachable" not in stdout: return True 
            return False
        except subprocess.CalledProcessError as e:
            print(f"Error: {e}")
            print(f"Error: {e.stderr.strip()}")
            return False

    def stop(self):
        print("trying to stop vm")
        result = subprocess.run(self.stop_command(), stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        del self.config.machines[self.name]
        self.update_config()
        if result.returncode == 0:
            print("VM stoped")
            self.status = "Offline"
        else:
            # Print error message if the command failed
            print(f"Error code: {result.returncode}")
            print(f"Error: {result.stderr.strip()}")

    def remove(self):
        print("Removing vm")
        data = json.load(open("config.json"))
        del data["machines"][self.name]
        fw = open("config.json","w")
        json.dump(data, fw)

    def is_file(self, file_path):
        return os.path.exists(file_path)