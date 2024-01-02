import axios from 'axios';
import { Label, TextInput, Button } from 'flowbite-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SetSetting(){
    
    const [vmwarePath, setVmwarePath] = useState("");

    const navigate = useNavigate();

    const handleSetSetting = () => {
        axios.post("/setting", {
            "vmware_path": vmwarePath
        })
        .then(res => {
            if (res.data.status == "Updated"){
                navigate("/")
            }
        })
    }

    return (
        <div className="w-full flex flex-col items-center">
            <form className="flex max-w-md flex-col gap-4">
                <div className="w-full">
                    <div className="mb-2 block">
                    <Label className="text-white" htmlFor="small" value="VMware Path" />
                    </div>
                    <TextInput id="small" type="text" sizing="sm" value={vmwarePath} onChange={ev => setVmwarePath(ev.target.value)} />
                </div>
                <Button onClick={handleSetSetting}>Submit</Button>
            </form>
        </div>
    )
}