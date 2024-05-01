import asyncio
import os
from vmware_tools import VMwareTools

vmrun_path = "C:\\Program Files (x86)\\VMware\\VMware Player\\vmrun.exe"
vmx_path = "D:\\metasploitable\\metasploitable-linux-2.0.0\\Metasploitable2-Linux\\Metasploitable.vmx"
async def main():
    manager = VMwareTools(vmrun_path)
    print(manager.validate_vmx(vmx_path))

asyncio.run(main())
