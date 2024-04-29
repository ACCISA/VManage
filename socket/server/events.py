from flask_socketio import emit
import logging

from .extensions import socketio
from vmware_tools import VMwareTools

manager = VMwareTools("C:\\Program Files (x86)\\VMware\\VMware Player\\vmrun.exe")

@socketio.on("connect")
def handle_connect():
    logging.debug("client connected")

@socketio.on("list_vms")
def handle_list_vms():
    emit("started_list_vms", broadcast=True)
    result = manager.list_running()
    emit("completed_list_vms",{"result":result} broadcast=True)
    logging.debug("list_vms event called")

@socketio.on("start_vm")
def handle_start_vm(vm_path):
    logging.debug("start_vm event called")
    emit("started_vm", {"vm":1,"status":"starting"}, broadcast=True)

