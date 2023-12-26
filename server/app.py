from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from VirtualMachine import VirtualMachine
import os
import json
import asyncio

load_dotenv()

VMWARE_PATH = os.getenv('VMWARE_PATH')
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



@app.get("/test")
async def test():
    return "ok"

@app.get("/setting")
async def get_setting():
    return "settings"

@app.post("/setting")
async def post_setting(request: Request):
    global VMWARE_PATH
    try:
        data = await request.json()
        if "vmware_path" not in data.keys(): return "Unknown Setting"

        vmware_path = data.get("vmware_path")
        if vmware_path is None: return "Invalid value for setting vmware_path"

        #store the setting somewhere
        VMWARE_PATH = vmware_path
        
        return "Setting Stored"
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/")

@app.post("/add")
async def post_add(request: Request):
    try:
        data = await request.json()
        print(data)
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
        
        print("Virutal machine started")

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

        return {"status": vm.status}

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/start")
async def create_item(request: Request):
    try:
        data = await request.json()
        # TODO verify content

        if "name" not in data.keys(): raise HTTPException(status_code=422, detail="Missing vm name")
        
        print("all data present")
        
        name = data.get("name")

        if name is None: raise HTTPException(status_code=422, detail="Name is required")
        
        global machines

        if name not in machines.keys(): raise HTTPException(status_code=422, detail=f"VM {name} not found")
        vm = machines[name]
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
        vm.stop()
        del machines[name]
        return f"vm {name} stoped"

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

def create_config_file():
    config_filename = 'config.json'

    # Check if the config file already exists
    if os.path.exists(config_filename):
        print(f"{config_filename} already exists. Skipping creation.")
        return

    # Default configuration
    default_config = {
        'vmware_path': '',
        'machines': {},
    }

    # Create the config file with default configurations
    with open(config_filename, 'w') as config_file:
        json.dump(default_config, config_file, indent=4)

    print(f"{config_filename} created with default configurations.")
# Run the FastAPI application on port 8080
if __name__ == "__main__":
    import uvicorn
    create_config_file()
    VirtualMachine.config_file = "config.json"
    uvicorn.run(app, host="localhost", port=8081)
