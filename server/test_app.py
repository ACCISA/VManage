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



@app.post("/")

@app.post("/add")
async def post_add(request: Request):
    return {"status":"Added"}


@app.post("/status")
async def post_status(request: Request):
    try:
        global loading
        status = "Offline"
        if loading: status = "Starting"
        if online: status = "Online"

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
        return {"status":"started"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))



@app.post("/stop")
async def post_stop(request: Request):
   return {"status":"Stoped"}

if __name__ == "__main__":
    import uvicorn
    VirtualMachine.config_file = "config.json"
    uvicorn.run(app, host="localhost", port=8081)
