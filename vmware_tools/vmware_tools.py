import os
import re
import sys
import subprocess
import logging
import asyncio


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s') # temp, upgrade format to better suite our needs

class VMwareTools():

    valid_commands = ["list","start"]
    vmrun_path = None

    def __init__(self):
        if sys.platform == 'win32':
            logging.warning("win32 detected")
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

        self.validate_vmrun()

    def validate_vmrun(self):
        if VMwareTools.vmrun_path is None: raise Exception()
        if not os.path.exists(VMwareTools.vmrun_path): raise Exception()
        if os.path.basename(VMwareTools.vmrun_path) != "vmrun" and os.path.basename(VMwareTools.vmrun_path) != "vmrun.exe": raise Exception()
        logging.info("using vmrun path: "+VMwareTools.vmrun_path)
        # this does not prevent people from executing other executables then vmrun, this is just to prevent errors in the library

    async def execute(commands: dict = {}):
        def run():
            executed_command = [VMwareTools.vmrun_path]
            
            for command in commands:
                if command not in VMwareTools.valid_commands: raise Exception()
                executed_command.append(command)
                executed_command.append(commands[command])

            logging.info("executing: "+" ".join(executed_command))

            process = subprocess.Popen(executed_command,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE)
            stdout, stderr = process.communicate()

            if len(stderr.decode()) != 0: return stderr.decode()
            return stdout.decode()
        return await asyncio.to_thread(run)

    async def list_running():
        result = await VMwareTools.execute({"list":""})
        logging.info(result)
        return result

    
