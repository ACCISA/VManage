from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from VirtualMachine import VirtualMachine
from typing import Dict
import os
import json
import logging
import asyncio

load_dotenv()

VMWARE_PATH = None
machines = {}
vm_run = "vmrun"
app = FastAPI(timeout=86400)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/setting")
async def get_setting():
    global VMWARE_PATH
    return {"vmware_path":VMWARE_PATH}


@app.post("/setting")
async def post_setting(request: Request):
    try:
        data = await request.json()
        if "vmware_path" not in data.keys(): return "Unknown Setting"

        vmware_path = data.get("vmware_path")
        if vmware_path is None: return "Invalid value for setting vmware_path"
        global VMWARE_PATH
        VMWARE_PATH = vmware_path
        print(f"vmware_path updated to {VMWARE_PATH}")
        old_setting = json.load(open("config.json"))
        old_setting["vmware_path"] = vmware_path
        fw = open("config.json","w")
        json.dump(old_setting, fw)
        return {"status":"Updated"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
        
@app.post("/login")
async def post_login(request: Request):
    try:

        # Terrible authentication but it doesnt matter

        data = await request.json()

        if "password" not in data.keys(): raise HTTPException(status_code=403, detail="Missing password")
        if "username" not in data.keys(): raise HTTPException(status_code=403, detail="Missing username")

        username = data.get("username")
        password = data.get("password")

        if username == "vmanage" and password == "vmanage": return {"status":"valid"}
        raise HTTPException(status_code=403, detail="Unauthorized access")


    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))

    
@app.post("/remove")
async def post_remove(request: Request):
    try:
        data = await request.json()

        if "name" not in data.keys(): raise HTTPException(status_code=422, detail="Missing vm name")

        name = data.get("name")

        if name is None: raise HTTPException(status_code=422, detail="Name is required")

        global machines
        if name not in machines.keys(): return {"status":"Unknown"}

        vm: VirtualMachine = machines[name]
        vm.remove()        
        del machines[name]
        return {"status":"Removed"}

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/add")
async def post_add(request: Request):
    try:
        data = await request.json()

        if "name" not in data.keys(): raise HTTPException(status_code=422, detail="Missing vm name")
        if "path" not in data.keys(): raise HTTPException(status_code=422, detail="Missing vm path")
        if "ip" not in data.keys(): raise HTTPException(status_code=422, detail="Missing ip")
        
        name = data.get("name")
        path = data.get("path")
        ip = data.get("ip")

        if name is None: raise HTTPException(status_code=422, detail="Name is required")
        if path is None: raise HTTPException(status_code=422, detail="Name is required")
        if ip is None: raise HTTPException(status_code=422, detail="Name is required")

        global VMWARE_PATH
        global machines

        vm = VirtualMachine(name,path,VMWARE_PATH,ip)
        machines[name] = vm
        
        logging.debug("vm added to config")
        return {"status":"Added"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/status")
async def post_status(request: Request):
    try:
        data = await request.json()

        if "name" not in data.keys(): raise HTTPException(status_code=422, detail="Missing vm name")

        name = data.get("name")
    
        if name is None: raise HTTPException(status_code=422, detail="vm name is None")
        global machines
        if name not in machines.keys(): raise HTTPException(status_code=422, detail=f"name {name} not found in stored machines")

        vm: VirtualMachine = machines.get(name)
        return_status = {"status": vm.status}
        if vm.status == "Failed":
            return_status = {"status":"Failed","details":vm.fail_reason}
        logging.debug(f"vm '{name}' -> {return_status}")
        return return_status
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/start")
async def create_item(request: Request):
    try:
        data = await request.json()

        if "name" not in data.keys(): raise HTTPException(status_code=422, detail="Missing vm name")
        
        name = data.get("name")

        if name is None: raise HTTPException(status_code=422, detail="Name is required")
        
        global machines
        global VMWARE_PATH

        if name not in machines.keys(): raise HTTPException(status_code=422, detail=f"VM {name} not found")
        vm = machines[name]
        vm: VirtualMachine
        vm.vmware_path = VMWARE_PATH
        logging.debug(f"vm '{name}' started -> {vm.vmware_path}")
        task = asyncio.create_task(vm.start())

        return {"status":"started"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/stop")
async def post_stop(request: Request):
    try:
        data = await request.json()

        if "name" not in data.keys(): raise HTTPException(status_code=422, detail="Missing vm name")

        name = data.get("name")

        if name is None: raise HTTPException(status_code=422, detail="vm name is None")
        global machines
        if name not in machines.keys(): raise HTTPException(status_code=422, detail=f"name {name} not found in stored machines")

        vm: VirtualMachine = machines.get(name)
        await vm.stop() # change this to create_task()
        return {"status":"Offline"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/vm")
async def get_vm(request: Request):
    machines_dict = []
    global machines
    global VMWARE_PATH
    running_vm = VirtualMachine.get_running_vms(VMWARE_PATH)
    for machine in machines.keys():
        vm: VirtualMachine = machines[machine]
        if vm.path in running_vm and vm.status != "Online":
            vm.status = "Online"
            vm.store() 
            continue   
        if vm.path not in running_vm and vm.status == "Online":
            vm.status = "Offline"
            vm.store()
            continue        
        machines_dict.append(vm.config.machines[machine])
    return {"machines":machines_dict}

def create_config_file():
    config_filename = 'config.json'

    # Check if the config file already exists
    if os.path.exists(config_filename):
        logging.warning(f"{config_filename} already exists. Skipping creation.")
        global VMWARE_PATH
        global machines
        config_data = json.load(open("config.json"))
        VMWARE_PATH = config_data["vmware_path"]
        machines_dict = config_data["machines"]      
        for machine in machines_dict.keys():
            vm = VirtualMachine(name=machines_dict[machine]["name"], path=machines_dict[machine]["path"],vmware_path=VMWARE_PATH,ip=machines_dict[machine]["ip"])
            machines[machine] = vm  
        return

    # Default configuration
    default_config = {
        'vmware_path': '',
        'machines': {},
    }

    # Create the config file with default configurations
    with open(config_filename, 'w') as config_file:
        json.dump(default_config, config_file, indent=4)

    logging.debug(f"{config_filename} created with default configurations.")
# Run the FastAPI application on port 8080
if __name__ == "__main__":
    import uvicorn
    create_config_file()
    VirtualMachine.config_file = "config.json"
    uvicorn.run(app, host="localhost", port=8081)
