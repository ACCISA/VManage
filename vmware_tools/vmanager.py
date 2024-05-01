import os
import re
import asyncio
import logging

from .machine import Machine
from .vmware_tools import VMwareTools

class VManager:

    def __init__(self) -> None:
        self.machines = []

    def is_stored(self, vmx_path):
        for k,machine in enumerate(self.machines):
            if machine.vmx_path == vmx_path: return True
        return False
    
    async def is_running(self, vmx_path):
        result = await VMwareTools.list_running()
        if vmx_path not in result: return False
        return True


    def validate_vmx(self, vmx_path):
        if not os.path.exists(VMwareTools.vmrun_path): return False
        _, file_ext = os.path.splitext(vmx_path)
        print(file_ext)
        if not file_ext == ".vmx": return False
        return True

    def import_vm(self, vmx_path):
        VMwareTools.execute({"start":vmx_path,"nogui":""})
        machine = Machine(vmx_path)
        self.add_machine(machine)

    def start_vm(vmx_path):
        VMwareTools.execute({"start":vmx_path})
        return

    def add_machine(self, machine: Machine):
        self.machines.append(machine)

    def remove_machine(self, target: Machine):
        for k,machine in enumerate(self.machines):
            if machine.vmx_path == target.vmx_path: 
                logging.info("removed machine: "+target.vmx_path)
                self.machine.pop(k)
                return
        logging.info("unable to remove: "+target.vmx_path)        
        return
    
    async def import_running(self):
        result = await self.list_running()
        if "Total running VMs: 0" in result:
            logging.info("no vms were imported")
            return
        result = result.strip()
        paths = result.split("\n")
        amount = re.search(r'\d+', paths[0])
        logging.info("Importing "+str(amount.group())+" machines")
        paths.pop(0)
        if paths[len(paths)-1] == '': paths.pop(len(paths)-1)
        logging.info(paths) #todo remove /r found in paths
