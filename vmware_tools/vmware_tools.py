import os
import re
import subprocess
import logging
import asyncio

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s') # temp, upgrade format to better suite our needs


class VMwareTools():
    
    valid_commands = ["list"]

    def __init__(self, vmrun_path: str):
        self.vmrun_path = vmrun_path

        self.validate_vmrun()

    def validate_vmrun(self):
        if self.vmrun_path is None: raise Exception()
        if not os.path.exists(self.vmrun_path): raise Exception()
        if os.path.basename(self.vmrun_path) != "vmrun" and os.path.basename(self.vmrun_path) != "vmrun.exe": raise Exception()
        logging.info("using vmrun path: "+self.vmrun_path)
        # this does not prevent people from executing other executables then vmrun, this is just to prevent errors in the library

    async def execute(self, commands: dict = {}):
        executed_command = [self.vmrun_path]
        
        for command in commands:
            if command not in VMwareTools.valid_commands: raise Exception()
            executed_command.append(command)
            executed_command.append(commands[command])

        logging.info("executing: "+" ".join(executed_command))

        process = await asyncio.create_subprocess_exec(*executed_command,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE)
        stdout, stderr = await process.communicate()

        if len(stderr.decode()) != 0: return stderr.decode()
        return stdout.decode()

    async def list_running(self):
        result = await self.execute({"list":""})
        logging.info(result)
        return result

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


    def start_machine(machine):
        return