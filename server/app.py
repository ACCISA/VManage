from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
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


@app.post("/getip")
async def post_getip(request: Request):
    try:
        data = await request.json()

        if "name" not in data.keys(): return JSONResponse(content={"status":"MISSING_KEY_NAME"}, status_code=422)

        name = data.get("name")

        if name is None or name == "": return JSONResponse(content={"status":"INVALID_KEY_NAME"}, status_code=422)
        
        global machines

        vm: VirtualMachine = machines[name]
        retrieved_ip = vm.get_ip()

    except Exception as e:
        return JSONResponse(content={"status":"GETIP_FAILED","detail":str(e)})



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
        if vmware_path is None or vmware_path == "": return {"status":"VM_FAILED","detail":"INVALID_VMWARE_VALUE"}
        if not VirtualMachine.is_file(vmware_path): return {"status":"VM_FAILED","detail":"INVALID_VMWARE_PATH_SETTING"}
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

        if "name" not in data.keys(): return JSONResponse(content={"status":"MISSING_KEY_NAME"}, status_code=422)

        name = data.get("name")

        if name is None or name == "": return JSONResponse(content={"status":"INVALID_KEY_NAME"}, status_code=422)
        
        global machines
        if name not in machines.keys(): 
            logging.error(f"vm '{name}' -> Failed, unknown vm name")
            return JSONResponse(content={"status":"UNKNOWN_VM_NAME"}, status_code=422)
        
        vm: VirtualMachine = machines[name]
        vm.remove()        
        del machines[name]
        return JSONResponse(content={"status":"VM_REMOVED"}, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/add")
async def post_add(request: Request):
    try:
        data = await request.json()

        if "name" not in data.keys(): return JSONResponse(content={"status":"MISSING_KEY_NAME"}, status_code=422)
        if "path" not in data.keys(): return JSONResponse(content={"status":"MISSING_KEY_NAME"}, status_code=422)
        if "ip" not in data.keys(): return JSONResponse(content={"status":"MISSING_KEY_NAME"}, status_code=422)
        
        name = data.get("name")
        path = data.get("path")
        ip = data.get("ip")

        if name is None or name == "":  return JSONResponse(content={"status":"INVALID_KEY_NAME"}, status_code=422)
        if path is None or path == "":  return JSONResponse(content={"status":"INVALID_KEY_NAME"}, status_code=422)
        if ip is None or ip == "": return JSONResponse(content={"status":"INVALID_KEY_NAME"}, status_code=422)

        global VMWARE_PATH
        global machines

        vm = VirtualMachine(name,path,VMWARE_PATH,ip)
        machines[name] = vm
        
        logging.debug("vm added to config")
        return JSONResponse(content={"status":"VM_ADDED"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"status":str(e)}, status_code=422)

@app.post("/status")
async def post_status(request: Request):
    try:
        data = await request.json()

        if "name" not in data.keys(): return JSONResponse(content={"status":"MISSING_KEY_NAME"},status_code=422)
        
        name = data.get("name")

        if name is None or name == "": return JSONResponse(content={"status":"INVALID_KEY_NAME"}, status_code=422)
        
        global machines
        if name not in machines.keys(): 
            logging.error(f"vm '{name}' -> Failed, unknown vm name")
            return JSONResponse(content={"status":"UNKNOWN_VM_NAME"}, status_code=422)

        vm: VirtualMachine = machines.get(name)
        return_status = {"status": vm.status}
        if vm.status == "VM_FAILED":
            return_status = {"status":"VM_FAILED","detail":vm.fail_reason}
        logging.debug(f"vm '{name}' -> {return_status}")
        return JSONResponse(content={"status":vm.status}, status_code=200)
    
    except Exception as e:
        return JSONResponse(content={"status":str(e)},status_code=200)

@app.post("/ping")
async def post_ping(request: Request):
    try:
        
        data = await request.json()
        if "name" not in data.keys(): return JSONResponse(content={"status":"MISSING_KEY_NAME"},status_code=422)
        name = data.get("name")

        if name is None or name == "": return JSONResponse(content={"status":"INVALID_KEY_NAME"}, status_code=422)
        
        global machines

        if name not in machines.keys(): 
            logging.error(f"vm '{name}' -> Failed, unknown vm name")
            return JSONResponse(content={"status":"UNKNOWN_VM_NAME"}, status_code=422)

        vm: VirtualMachine = machines[name]
        status = await vm.ping_host()
        logging.debug(f"vm '{vm.name}' ping -> {status}")
        return JSONResponse(content={"status":"HOST_UP" if status else "HOST_DOWN"}, status_code=200)

    except Exception as e:
        logging.debug(f"vm '{vm.name}' ping -> {status}")
        return JSONResponse(content={"status":"HOST_DOWN"},status_code=200)

@app.post("/start")
async def create_item(request: Request):
    try:
        data = await request.json()

        if "name" not in data.keys(): return JSONResponse(content={"status":"MISSING_KEY_NAME"}, status_code=422)
        
        name = data.get("name")

        if name is None or name == "": return JSONResponse(content={"status":"INVALID_KEY_NAME"}, status_code=422)
        
        global machines
        global VMWARE_PATH

        if name not in machines.keys(): 
            logging.error(f"vm '{name}' -> Failed, unknown vm name")
            return JSONResponse(content={"status":"UNKNOWN_VM_NAME"}, status_code=422)
        vm: VirtualMachine = machines[name]
        vm.vmware_path = VMWARE_PATH
        
        status, path = vm.validate_paths()
        if not status:
            logging.error(f"vm '{name}' -> Failed, {path} does not exists")
            return JSONResponse(content={"status":"INVALID_VMWARE_PATH" if path == "vmware_path" else "INVALID_VMX_PATH"}, status_code=422)
        
        logging.debug(f"vm '{name}' started -> {vm.vmware_path}")
        task = asyncio.create_task(vm.start())

        return JSONResponse(content={"status":"START_SUCCESS"}, status_code=200)
    except Exception as e:
        logging.error(str(e))
        return JSONResponse(content={"status":str(e)}, status_code=422)

@app.post("/stop")
async def post_stop(request: Request):
    try:
        data = await request.json()

        if "name" not in data.keys(): return JSONResponse(content={"status":"MISSING_KEY_NAME"}, status_code=422)
        
        name = data.get("name")

        if name is None or name == "": return JSONResponse(content={"status":"INVALID_KEY_NAME"}, status_code=422)
        global machines
        if name not in machines.keys(): 
            logging.error(f"vm '{name}' -> Failed, unknown vm name")
            return JSONResponse(content={"status":"UNKNOWN_VM_NAME"}, status_code=422)
        vm: VirtualMachine = machines.get(name)
        await vm.stop() # change this to create_task()

        return JSONResponse(content={"status":"STOP_SUCCESS"}, status_code=200)
    
    except Exception as e:
        return JSONResponse(content={"status":str(e)}, status_code=422)

@app.get("/vm")
async def get_vm(request: Request):
    machines_dict = []
    global machines
    global VMWARE_PATH
    running_vm = VirtualMachine.get_running_vms(VMWARE_PATH)
    for machine in machines.keys():
        vm: VirtualMachine = machines[machine]
        if vm.path in running_vm and vm.status != "VM_ONLINE":
            vm.status = "VM_ONLINE"
            vm.store() 
            continue   
        if vm.path not in running_vm and vm.status == "VM_ONLINE":
            vm.status = "VM_OFFLINE"
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

    logging.basicConfig(level=logging.DEBUG)

    create_config_file()
    VirtualMachine.config_file = "config.json"
    uvicorn.run(app, host="localhost", port=8081)
