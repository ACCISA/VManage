# from VirtualMachine import VirtualMachine
# from dotenv import load_dotenv
# import os
# from app import create_config_file
# load_dotenv()

# VMWARE_PATH = os.getenv('VMWARE_PATH')
# vm = VirtualMachine("test",'D:\\metasploitable\\metasploitable-linux-2.0.0\\Metasploitable2-Linux\\Metasploitable.vmx',VMWARE_PATH,"192.168.111.222")
# print(type(vm.status))
# vm.store()
import subprocess

def run_command(command):
    result = subprocess.run(command, stdout=subprocess.PIPE, text=True, shell=True)
    stdout = result.stdout.strip()
    result_code = result.returncode
    return (stdout, result_code)    

run_command("ping 12ss7.0.0.1")