import axios from "axios";
import { useEffect, useState } from "react";
import VMComponent from "../components/VMComponent"

export default function Index() {

    const [machines, setMachines] = useState([]);

    const renderMachines = machines.map((item, index) => (
        <VMComponent vm_name={item.name} vm_path={item.path} vm_ip={item.ip} vm_os={item.os}></VMComponent>
    ))
    console.log(machines)

    useEffect(() => {
        const retrieveVM = () => {
            axios.get("/vm")
            .then(res => {
                setMachines(res.data.machines)
            })
        }
    
        retrieveVM();
    }, [])

    return (

        <div className="text-white">
            {renderMachines}
        </div>

    )

}