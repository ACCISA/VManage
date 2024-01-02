# from VirtualMachine import VirtualMachine
# from dotenv import load_dotenv
# import os
# from app import create_config_file
# load_dotenv()

# VMWARE_PATH = os.getenv('VMWARE_PATH')
# vm = VirtualMachine("test",'D:\\metasploitable\\metasploitable-linux-2.0.0\\Metasploitable2-Linux\\Metasploitable.vmx',VMWARE_PATH,"192.168.111.222")
# print(type(vm.status))
# vm.store()
from pythonping import ping

t = str(ping('127.0.0.1',verbose=True,count=1))

print("---")
print(t, 'ss')