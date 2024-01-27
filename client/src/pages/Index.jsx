import axios from "axios";
import { useEffect, useState } from "react";
import VMComponent from "../components/VMComponent"
import VMCard from "../components/VMCard";
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { useLocation } from "react-router-dom";
import { setMessage } from "../utils/notification";
import { Store } from "react-notifications-component";

export default function Index() {

    const [machines, setMachines] = useState([]);

    let location = useLocation();

    const renderMachines = machines.map((item, index) => (
        <VMCard vm_status={item.status} vm_name={item.name} vm_path={item.path} vm_ip={item.ip} vm_os={item.os}></VMCard>
    ))
    
    useEffect(() => {
        if (location.state != null && 'notification' in location.state){
            console.log(location.state)
            let notification = setMessage("vmanage_success",location.state['notification'],location.state['name'])
            Store.addNotification(notification);
            window.history.replaceState({}, document.title);
            return;
        }
        let notif = localStorage.getItem("notification")
        let rm_name = localStorage.getItem("name")
        if (notif != null){
            let notification = setMessage("vmanage_success", notif, rm_name);
            Store.addNotification(notification);
            localStorage.removeItem("notification");
            localStorage.removeItem("name");
        }        
    }, [location])
    

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
        <div>
            <div className="text-white">
                {renderMachines}
            </div>
        </div>
        

    )

}