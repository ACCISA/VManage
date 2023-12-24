from VirtualMachine import VirtualMachine
from dotenv import load_dotenv
import os

load_dotenv()

VMWARE_PATH = os.getenv('VMWARE_PATH')

vm = VirtualMachine("test",r'C:\\Users\\darra\\Documents\\metasploitable-linux-2.0.0\\Metasploitable2-Linux\\Metasploitable.vmx',VMWARE_PATH)

vm.start()