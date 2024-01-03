import axios from 'axios';
import { Label, TextInput, Button } from 'flowbite-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import {notifications, setMessage} from '../utils/notification';

export default function SetSetting(){
    
    const [vmwarePath, setVmwarePath] = useState("");

    const navigate = useNavigate();

    const handleSetSetting = (ev) => {
        ev.preventDefault();
        axios.post("/setting", {
            "vmware_path": vmwarePath
        })
        .then(res => {
            if (res.data.status == "Updated"){
                navigate("/",{state: {notification: "vm_setting"}});
                return;
            }
            if (res.data.status == "VM_FAILED"){
                let notification = setMessage("vmanage_fail",res.data.detail,vmwarePath)
                Store.addNotification(notification)
            }
            // Error handling if settings update failed + set details to notifications
        })
    }

    return (
        <div className="w-full flex flex-col items-center">
            <form className="flex max-w-md flex-col gap-4 bg-vm-info-color-500 p-4 rounded-md text-white border-white shadow-white shadow-md" onSubmit={handleSetSetting}>
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="small" value="VMware Path" />
                    </div>
                    <TextInput id="small" type="text" sizing="sm" value={vmwarePath} required onChange={ev => setVmwarePath(ev.target.value)} />
                </div>
                <Button type="submit" className='border-white'>Submit</Button>
            </form>
        </div>
    )
}