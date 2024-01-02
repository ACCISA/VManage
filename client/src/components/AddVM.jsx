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
            navigate("/")
        })

    }


    return (
        <div className="w-full flex flex-col items-center">
            <form className="flex max-w-md flex-col gap-4">
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="small" value="VM Name" />
                    </div>
                    <TextInput id="small" type="text" sizing="sm" value={vm_name} onChange={ev => setName(ev.target.value)} />
                </div>
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="base" value="VM Operating System" />
                    </div>
                    <TextInput id="base" type="text" sizing="md" value={vm_os} onChange={ev => setOs(ev.target.value)} />
                </div>
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="base" value="VM IP" />
                    </div>
                    <TextInput id="base" type="text" sizing="md" value={vm_ip} onChange={ev => setIp(ev.target.value)} />
                </div>
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="base" value="VM Path" />
                    </div>
                    <TextInput id="base" type="text" sizing="md" value={vm_path} onChange={ev => setPath(ev.target.value)} />
                </div>
                <Button onClick={handleAddVM}>Submit</Button>
            </form>
        </div>



    )
}
