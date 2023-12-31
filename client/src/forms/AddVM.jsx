import { useState } from "react";
import { Label, TextInput, Button } from 'flowbite-react';

export default function AddVM() {



    const [vm_name, setName] = useState('');
    const [vm_path, setPath] = useState('');
    const [vm_os, setOs] = useState('');
    const [vm_ip, setIp] = useState('');

    const handleAddVM = async (ev) => {
        ev.preventDefault();
        axios.post("http://localhost:8081/add", {
            "name": vm_name,
            "path": vm_path,
            "ip": vm_ip
        })

    }


    return (
        <div className="w-full flex flex-col items-center">
            <form className="flex max-w-md flex-col gap-4">
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="small" value="VM Name" />
                    </div>
                    <TextInput id="small" type="text" sizing="sm" />
                </div>
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="base" value="VM Operating System" />
                    </div>
                    <TextInput id="base" type="text" sizing="md" />
                </div>
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="base" value="VM IP" />
                    </div>
                    <TextInput id="base" type="text" sizing="md" />
                </div>
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="base" value="VM Path" />
                    </div>
                    <TextInput id="base" type="text" sizing="md" />
                </div>
                <Button>Submit</Button>
            </form>
        </div>



    )
}
