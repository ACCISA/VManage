import React, { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../test.css'
import { Store } from 'react-notifications-component';
import { setMessage } from '../utils/notification';


const VMComponent = ({vm_status, vm_name, vm_path, vm_ip, vm_os}) => {

  const [status, setStatus] = useState(vm_status);
  const [isRunning, setIsRunning] = useState((vm_status == "VM_OFFLINE") ? false : true);
  const [bgStatus, setBgStatus] = useState("bg-red-600");
  
  let navigate = useNavigate();

  const handleStartStopVM = (ev) => {
    if (isRunning){
      axios.post('/stop',
        {
          "name": vm_name
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(res_stop => {
          setStatus("VM_OFFLINE");
          setIsRunning(false);
          if (res_stop.status == 200){
            let notification = setMessage("vmanage_success", res_stop.data.status);
            Store.addNotification(notification);
          }
          
        });
      return;
    }
    ev.preventDefault();
    setIsRunning(true)
    console.log("Attempting to launch VM");
    axios.post('/start',
    {
      "name": vm_name
    }, 
    {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res_start => {
      if (res_start.data.status == "START_SUCCESS") {
        let notification = setMessage("vmanage_success","START_SUCCESS",vm_name)
        Store.addNotification(notification)
        pollAPIStatus().then(() => {console.log("vm was seen online")});
      }
    })
    .catch(res_error => {
      console.log(res_error)
      if (res_error.response.status == 422){
        let notification = setMessage("vmanage_fail",res_error.response.data.status, vm_name);
        Store.addNotification(notification);
        setIsRunning(false);
      }
    });
  }

  const pollAPIStatus = async () => {
    let value = 0;
    let is_online = false;
    while (true) {
      value = value  + 1
      if (value > 1000) break;

      axios.post('/status',
        {
          "name":vm_name
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(res_status => {
          setStatus(res_status.data.status)
          if (res_status.data.status == "VM_ONLINE") {
            is_online = true;
            let notification = setMessage("vmanage_info",res_status.data.status,vm_name);
            Store.addNotification(notification);
          }
          if (res_status.data.status == "VM_FAILED") {
            is_online = true;
            let notification = setMessage("vmanage_fail",res_status.data.status,vm_name);
            Store.addNotification(notification);
          }
      })
      if (is_online) break;
      await new Promise(resolve => {
        setTimeout(() => {resolve()}, 1000)
      });
       
    }
  }

  const handleEditVM = () => {
    console.log("edit the vm's setting and send it to the server")
  }

  const handlePingVM = () => {
    axios.post("/ping",{
      "name": vm_name
    },{
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => {
      let notification = setMessage("vmanage_info",(res.data.status == "HOST_DOWN")? "HOST_DOWN" : "HOST_UP",vm_name, vm_ip);
      Store.addNotification(notification);
    })
  }

  const handleRemoveVM = () => {
    axios.post("/remove", {
      "name":vm_name
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      localStorage.setItem("notification", res.data.status)
      localStorage.setItem("name", vm_name)
      window.location.reload()
    })
  }

  useEffect(() => {
    if (status == "VM_OFFLINE" || status == "VM_FAILED") {
      setIsRunning(false);
      setBgStatus("bg-red-600");
    }
    if (status == "VM_STARTING"){
      setBgStatus("bg-yellow-300");
    }
    if (status == "VM_ONLINE"){
      setBgStatus("bg-green-500");
    } 
  }, [status])

  useEffect(() => {
    
  },[bgStatus])

  return (
    <div>
      <div className="bg-vm-info-color-500 info">

        <div className='flex flewx-col items-center justify-between'>
          <div className='flex flex-row gap-4 m-4 text-xl '>
            <h3>{vm_name}</h3>
            <h3>{vm_path}</h3>
            <h3>{vm_ip}</h3>
            <h3>{vm_os}</h3>
          </div>
          <div className={`${bgStatus} w-10  h-10 mr-4 rounded-full flex items-center justify-center border-solid`}></div>
        
        </div>
        <div className='flex flex-row gap-4 m-4 items-center'>
          <Button className='bg-red-600' onClick={handleRemoveVM}>
            Remove
          </Button>
          <Button className="bg-gray-500" onClick={handleEditVM}>
            Edit 
            {/* <FaEdit className='ml-2' />   */}
          </Button>
          <Button className="bg-gray-500" onClick={handlePingVM}>
            Ping 
            {/* <FaEdit className='ml-2' />   */}
          </Button>
          <Button className="bg-green-500" onClick={handleStartStopVM}>
            {isRunning ? 'Stop' : 'Start'}
          </Button>

        </div>
        
      </div>
     
    </div>
  );
};

export default VMComponent;
