import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';
import axios from 'axios'

export default function Add() {

    const [name, setName] = useState("test");
    const [path, setPath] = useState("D:\\metasploitable\\metasploitable-linux-2.0.0\\Metasploitable2-Linux\\Metasploitable.vmx");
    const [ip, setIp] = useState("192.168.111.222");

    const handleAddVM = async (ev) => {
        ev.preventDefault();
        axios.post("http://localhost:8081/add", {
          "name":name,
          "path":path,
          "ip":ip
        })
    }



    return (
        <form className="flex max-w-md flex-col gap-4" onSubmit={handleAddVM}>
            <div>
                <div className="flex flex-row p-2 items-center gap-4">
                    <Label htmlFor="vm_name" value="VM Name" />
                    <TextInput id="vm_name" type="text" placeholder="name@flowbite.com" value={name} onChange={ev => setName(ev.target.value)} required />
                </div>
            </div>
            <div>
                <div className="flex flex-row p-2 items-center gap-4">
                    <Label htmlFor="vm_path" value="VM Path" />
                    <TextInput id="vm_path" type="text" value={path} onChange={ev => setPath(ev.target.value)} required />
                </div>
            </div>
            <div>
                <div className="flex flex-row p-2 items-center gap-4">
                    <Label htmlFor="vm_ip" value="VM IP" />
                    <TextInput id="vm_ip" type="text" value={ip} onChange={ev => setIP(ev.target.value)} required />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button type="submit">Create VM</Button>
        </form>
    )
}