import { useState } from "react";


export default function AddVM() {



    const form = useForm();
    const [vm_name, setName] = useState('');
    const [vm_path, setPath] = useState('');
    const [vm_os, setOs] = useState('');
    const [vm_ip, setIp] = useState('');

    const handleAddVM = async (ev) => {
        ev.preventDefault();
        axios.post("http://localhost:8081/add", {
          "name":vm_name,
          "path":vm_path,
          "ip":vm_ip
        })
    
      }

    
    return (
        <div className="create">
            <h2>Add VM</h2> 
            <form onSubmit={handleAddVM}></form>
            <label>Name</label>
            <input 
                type="text"
                required
                value={vm_name}
                onChange={(e) => setName(e.target.value)}
            />
            <label>VM Name</label>
            
            <input 
                type="text"
                required
                value={vm_path}
                onChange={(e) => setPath(e.target.value)}
            />
            <label>OS Name</label>
            
            <input 
                type="text"
                required
                value={vm_os}
                onChange={(e) => setOs(e.target.value)}
            />
            <label>OS Name</label>
            
            <input 
                type="number" placeholder="xxx.xxx.xxx.xx"
                required
                value={vm_ip}
                onChange={(e) => setIp(e.target.value)}
            />

        </div>



    )
}