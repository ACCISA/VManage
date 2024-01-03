import { useState } from "react";
import { Label, TextInput, Button } from 'flowbite-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddVM() {



    const [vm_name, setName] = useState('');
    const [vm_path, setPath] = useState('');
    const [vm_os, setOs] = useState('');
    const [vm_ip, setIp] = useState('');
    const navigate = useNavigate();

    const handleAddVM = async (ev) => {
        ev.preventDefault();
        axios.post("/add", {
            "name": vm_name,
            "path": vm_path,
            "ip": vm_ip
        })
        .then(res => {
            navigate("/", {state: {notification: res.data.status, name: vm_name}})
        })

    }


    return (
        <div className="w-full flex flex-col items-center ">
            <form className="flex max-w-md flex-col gap-4 bg-vm-info-color-500 p-4 rounded-md text-white border-white shadow-white shadow-md" onSubmit={handleAddVM}>
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="small" value="VM Name" />
                    </div>
                    <TextInput required id="small" type="text" sizing="sm" value={vm_name} onChange={ev => setName(ev.target.value)} />
                </div>
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="base" value="VM Operating System" />
                    </div>
                    <TextInput required id="base" type="text" sizing="md" value={vm_os} onChange={ev => setOs(ev.target.value)} />
                </div>
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="base" value="VM IP" />
                    </div>
                    <TextInput required id="base" type="text" sizing="md" value={vm_ip} onChange={ev => setIp(ev.target.value)} />
                </div>
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="base" value="VM Path" />
                    </div>
                    <TextInput required id="base" type="text" sizing="md" value={vm_path} onChange={ev => setPath(ev.target.value)} />
                </div>
                <Button type="submit" className="border-white">Submit</Button>
            </form>
        </div>



    )
}
