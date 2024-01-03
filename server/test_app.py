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
loading = False
online = False
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



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

        print(f"Virutal machine added {data}")
        return {"status":"Added"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/status")
async def post_status(request: Request):
    try:
        global loading
        status = "VM_OFFLINE"
        if loading: status = "VM_STARTING"
        if online: status = "VM_ONLINE"

        print(status)
        return {"status": status}

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

async def start_loading():
    print("doing fake sleep")
    await asyncio.sleep(10)
    global loading
    global online
    loading = False
    online = True
    print("sleep done")

@app.post("/start")
async def create_item(request: Request):
    try:
        data = await request.json()
        # TODO verify content

        if "name" not in data.keys(): raise HTTPException(status_code=422, detail="Missing vm name")
        name = data.get("name")
        if name is None: raise HTTPException(status_code=422, detail="Name is required")
        global loading
        loading = True
        asyncio.create_task(start_loading())
        print("trying to start machine")
        return {"status":"started"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))



@app.post("/stop")
async def post_stop(request: Request):
   global loading
   loading = False
   global online
   online = False
   return {"status":"Stoped"}

if __name__ == "__main__":
    import uvicorn
    VirtualMachine.config_file = "config.json"
    uvicorn.run(app, host="localhost", port=8081)
