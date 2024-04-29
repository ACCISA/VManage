import asyncio
import os
# from vmware_tools import VMwareTools

# vmrun_path = "C:\\Program Files (x86)\\VMware\\VMware Player\\vmrun.exe"
# async def main():
#     manager = VMwareTools(vmrun_path)
#     await manager.list_running()

# asyncio.run(main())

import mimetypes

file_path = "E:\\vm\\Kali.vmx"
print(file_path)
print(os.path.exists(file_path))
print(mimetypes.guess_type(file_path))