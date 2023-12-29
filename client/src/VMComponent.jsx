import React, { useState } from 'react';
import './test.css'
import { Button } from 'flowbite-react';
import { FaEdit } from 'react-icons/fa'; // Import the edit icon from a library like Font Awesome

const VMComponent = ({vm_name, vm_path, vm_ip, vm_os}) => {

  const handleButtonClick = () => {
    setIsClicked((prev) => !prev);
  };

  const handleStartVM = (ev) => {
    ev.preventDefault();
    console.log("Attempting to launch VM");
    axios.post('http://localhost:8081/start',
    {
      "name": launchName
    }, 
    {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res_start => {
      console.log(res_start.data);
      handleTestSleep().then(() => {console.log("all done")});
    });
  }

  const [isRunning, setIsRunning] = useState(false);


  return (
    <div>
      <div className="bg-vm-info-color-500 info">

        <div className='flex flewx-col items-center justify-between'>
          <div className='flex flex-row gap-4 m-4 font-extralight text-xl'>
            <h3>{vm_name}</h3>
            <h3>{vm_path}</h3>
            <h3>{vm_ip}</h3>
            <h3>{vm_os}</h3>
          </div>
          <div class="w-10 h-10 mr-4 bg-red-600 rounded-full flex items-center justify-center border-solid border-red-700"></div>
        
        </div>
        <div className='flex flex-row gap-4 m-4 items-center'>
          <Button className="bg-gray-500" onClick={handleStartVM}>
            Edit 
            {/* <FaEdit className='ml-2' />   */}
          </Button>
          <Button className="bg-green-500" onClick={handleStartVM}>
            {isRunning ? 'Stop' : 'Start'}
          </Button>
        </div>
        
      </div>
     
    </div>
  );
};

export default VMComponent;
