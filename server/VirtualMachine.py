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

    def list_command(self):
        return f'"{self.vmware_path}vmrun" list'

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
        self.store()
        if result.returncode == 0:
            print("VM started, pinging host")
            await self.is_running()
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

    async def stop(self):
        print("trying to stop vm")

        if not self.is_file(self.path):
            self.status = "Failed"
            self.fail_reason = "vmx file path does not exists"
            print("VM file path does not exist")
            return

        if not self.is_file(self.vmware_path):
            self.status = "Failed"
            self.fail_reason = "VMware folder does not exists"
            self.store()
            print("VMware folder does not exists")
            return
        
        if not await self.is_running():
            self.status = "Offline"
            self.store()
            return

        result = subprocess.run(self.stop_command(), stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        
        if result.returncode == 0:
            print("VM stoped")
            self.status = "Offline"
        else:
            self.status = "Failed"
            self.fail_reason = "vmx file is being used by another process"
            print(f"Error code: {result.returncode}")
            print(f"Error: {result.stderr.strip()}")
        self.store()
        

    def remove(self):
        print("Removing vm")
        data = json.load(open("config.json"))
        del data["machines"][self.name]
        fw = open("config.json","w")
        json.dump(data, fw)

    def is_file(self, file_path):
        return os.path.exists(file_path)
    
    async def is_running(self):
        result = VirtualMachine.get_running_vms(self.vmware_path)
        if self.path in result: return True
        return False
    
    def get_running_vms(vmware_path):
        return subprocess.run(f'"{vmware_path}vmrun" list'
            , stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True).stdout.strip()
        