from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import sys
import logging

from vmware_tools import VManager, VMwareTools

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

VMwareTools.vmrun_path = "C:\\Program Files (x86)\\VMware\\VMware Player\\vmrun.exe"
manager = VManager()

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

    yield sse_format({"status":"VALIDATING_VMX"})
    await asyncio.sleep(1.5)

    is_valid = manager.validate_vmx(vmx_path)
    if not is_valid:
        logging.warning("invalid vmx path: "+vmx_path)
        yield sse_format({"status":"INVALID_VMX"})
        return

    yield sse_format({"status":"STARTING_VM"})
    logging.info("starting vm")
    await asyncio.sleep(2)
    logging.info("completed vm startup")
    # result = await manager.start_vm()
    yield sse_format({"status":"VM_STARTED"})

async def event_start_import(vmx_path: str):

    yield sse_format({"status":"VALIDATING_VMX"})
    is_valid = manager.validate_vmx(vmx_path)
    if not is_valid:
        logging.warning("invalid vmx path: "+vmx_path)
        yield sse_format({"status":"INVALID_VMX"})
        return
    yield sse_format({"status":"CHECKING_VM"})
    is_stored = manager.is_stored(vmx_path)
    if is_stored:
        logging.warning("imported vm already stored")
        # note to note add a Machine component in the front end since this machine is already stored
        yield sse_format({"status":"FOUND_VM"})

    # maybe check if the machine is already stored
    yield sse_format({"status":"STARTING_VM"})
    manager.import_vm(vmx_path)
    yield sse_format({"status":"VM_STARTED"})

async def event_stop_vm(vmx_path: str):
    is_valid = manager.validate_vmx(vmx_path)
    if not is_valid:
        logging.warning("stop invalid vmx path")
        yield sse_format({"status":"INVALID_VMX"})
        return
    is_running = await manager.is_running(vmx_path)
    if not is_running:
        logging.warning("trying to stop vm that is not running: "+vmx_path)
        yield sse_format({"status":"NOT_RUNNING"})
        return
    yield sse_format({"status":"STOPING_VM"})
    await asyncio.sleep(2)
    yield sse_format({"status":"VM_STOPPED"})

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
async def handle_start_vm(vmx_path: str = Query(...)):
    return StreamingResponse(event_start_vm(vmx_path), media_type='text/event-stream')

@app.get("/start_import")
async def handle_start_import(vmx_path: str = Query(...)):
    return StreamingResponse(event_start_import(vmx_path), media_type='text/event-stream')

@app.get("/stop_vm")
async def handle_stop_vm(vmx_path: str = Query(...)):
    return StreamingResponse(event_stop_vm(vmx_path), media_type='text/event-stream')

@app.get("/set_vmrun")
async def handle_set_vmrun(vmrun_path: str = Query(...)):
    is_valid = VMwareTools.validate_vmrun()
    if not is_valid:
        logging.warning("invalid vmrun provided")
        return {"status":False}
    VMwareTools.vmrun_path = vmrun_path
    return {"status":True}
        