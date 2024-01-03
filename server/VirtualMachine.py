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
import logging

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
            logging.error(e)
        self.status = "VM_OFFLINE"
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
        logging.debug("Data Updated")

    async def start(self):
        # result = os.popen(self.start_command).read()
        if await self.ping_host():
            logging.warning("VM already started")
            return
        
        status, path = self.validate_paths()
        if not status:
            logging.error(f"{path} does not exists")
            self.status = "VM_OFFLINE"
            self.fail_reason = f"{path} does not exists"
            self.store()
            return
        
        result = subprocess.run(self.start_command(), stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        self.status = "VM_STARTING"
        self.store()
        if result.returncode == 0:
            logging.debug("VM started, pinging host")
            await self.is_running()
            await self.check_connection()
            self.status = "VM_ONLINE"
            logging.debug("VM is online")
            self.store()
        else:
            self.status = "VM_FAILED"
            if result.returncode == 4294967295:
                logging.error("vmx file is being used by another process")
                self.fail_reason = "File is being used by another process"
                return
            if "is not recognized as an internal or external command" in result.stderr.strip():
                logging.error("vmrun.exe is missing in the vmware_path")
                self.fail_reason = "Invalid vmrun path"
                return
            logging.error("vm start failed")
            self.fail_reason = result.stderr.strip()

    async def check_connection(self):
        is_online = False 
        while not is_online:
            await asyncio.sleep(1)
            is_online = await self.ping_host()
            

    async def ping_host(self):
        try:
            stdout = str(ping(self.ip,verbose=False,count=1))
            if "timed out" not in stdout and "host unreachable" not in stdout: return True 
            logging.debug(f"{self.ip} is down")
            return False
        except Exception as e:
            logging.error(f"error pinging {self.ip}")
            return False

    async def stop(self):
        
        status, path = self.validate_paths()
        if not status:
            logging.error(f"{path} does not exists")
            self.status = "VM_OFFLINE"
            self.fail_reason = f"{path} does not exists"
            self.store()
            return
        
        if not await self.is_running():
            logging.warning("vm was already offline")
            self.status = "VM_OFFLINE"
            self.store()
            return
        
        result = subprocess.run(self.stop_command(), stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        
        if result.returncode == 0:
            logging.debug("vm was stoped")
            self.status = "VM_OFFLINE"
        else:
            self.status = "VM_FAILED"
            self.fail_reason = "vmx file is being used by another process"
            logging.debug("vmrun stop failed")
            logging.debug(f"Error: {result.stderr.strip()}")

        self.store()

    def remove(self):
        data = json.load(open("config.json"))
        del data["machines"][self.name]
        fw = open("config.json","w")
        json.dump(data, fw)
        logging.debug("vm was removed from config")

    def validate_paths(self):
        if not VirtualMachine.is_file(self.vmware_path): return (False, "vmware_path")
        if not VirtualMachine.is_file(self.path): return (False, "vmx_path")
        return (True, None)

    def is_file(file_path):
        return os.path.exists(file_path)
    
    async def is_running(self):
        result = VirtualMachine.get_running_vms(self.vmware_path)
        if self.path in result: return True
        return False
    
    def get_running_vms(vmware_path):
        return subprocess.run(f'"{vmware_path}vmrun" list'
            , stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True).stdout.strip()
        

def run_command(command):
    result = subprocess.run(command, stdout=subprocess.PIPE, text=True, shell=True)
    stdout = result.stdout.strip()
    result_code = result.returncode
    return (stdout, result_code)