from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import sys

from vmware_tools import VMwareTools

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = VMwareTools("C:\\Program Files (x86)\\VMware\\VMware Player\\vmrun.exe")

def sse_format(data):
        json_data = json.dumps(data)
        return f"data: {json_data}\n\n"

async def event_generator():
    
    yield "data: {\"status\": \"Starting\"}\n\n"
    await asyncio.sleep(2)
    yield "data: {\"status\": \"Pending\"}\n\n"
    await asyncio.sleep(2)
    yield "data: {\"status\": \"Completed\"}\n\n"

async def event_list_vms():

    yield sse_format({"status":"STARTING_LIST_VMS"})
    result = await manager.list_running()
    yield sse_format({"status":"COMPLETED_LIST_VMS","result":result})

async def event_start_vm(vmx_path: str):

    yield sse_format({"status":"STARTING_VM"})
    result = await manager.start_vm():
    yield sse_format({"status":"VM_STARTED"})


@app.get("/test")
async def test():
    return StreamingResponse(event_generator(), media_type='text/event-stream')

@app.get("/")
async def handle_status():
    return "ok"
 
@app.get("/list_vms")
async def handle_list_vms():
    return StreamingResponse(event_list_vms(), media_type='text/event-stream') 

@app.get("/start_vm")
async def handle_start_vm(vmpath):
    return StreamingResponse(event_start_vm(), media_type='text/event-stream')