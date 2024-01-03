import React, { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../test.css'

const VMComponent = ({vm_status, vm_name, vm_path, vm_ip, vm_os}) => {

  const [status, setStatus] = useState(vm_status);
  const [isRunning, setIsRunning] = useState((vm_status == "Offline") ? false : true);
  const [bgStatus, setBgStatus] = useState("bg-red-600")
  


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
        .then(res_start => {
          setStatus("Offline")
          setIsRunning(false)
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
      console.log(res_start.data);
      pollAPIStatus().then(() => {console.log("all done")});
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
          if (res_status.data.status == 'Online') is_online = true;
          if (res_status.data.status == 'Failed') is_online = true;
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
      console.log("then called")
      window.location.reload()
    })
  }

  useEffect(() => {
    if (status == "Offline" || status == "Failed") {
      setBgStatus("bg-red-600")
    }
    if (status == "Starting"){
      setBgStatus("bg-yellow-300")
    }
    if (status == "Online"){
      setBgStatus("bg-green-500")
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
          <Button className="bg-green-500" onClick={handleStartStopVM}>
            {isRunning ? 'Stop' : 'Start'}
          </Button>
        </div>
        
      </div>
     
    </div>
  );
};

export default VMComponent;
