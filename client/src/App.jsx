import axios from 'axios'
import { useState } from 'react';

function App() {

  const [statusAPI, setStatusAPI] = useState("");

  const handleLaunchVM = () => {
    console.log("Attempting to launch VM");
    axios.post('http://localhost:8081/start',
    {
      "name": "test",
      "path": "D:\\metasploitable\\metasploitable-linux-2.0.0\\Metasploitable2-Linux\\Metasploitable.vmx",
      "ip": "192.168.111.222"
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

  const handleTestSleep = async () => {
    let value = 0;
    let is_online = false;
    while (true) {
      value = value  + 1
      if (value > 1000) break;

      axios.post('http://localhost:8081/status',
        {
          "name":"test"
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(res_status => {
          console.log(res_status.data);
          console.log(res_status.data.status);
          if (res_status.data.status == "Online") {
            is_online = true;
            console.log("vm is online");
          }
      })
      if (is_online) break;
      await new Promise(resolve => {
        setTimeout(() => {resolve()}, 1000)
      })
       
    }
    console.log("for loop done")
  }
  

  return (
    <>
      <div className='flex justify-center content-center'>
        <button onClick={handleLaunchVM} className='bg-red-500 p-4'>
          Test Launch VM
        </button>
        <button onClick={handleTestSleep}>
          Test Sleep
        </button>
      </div>
      <h1>{statusAPI}</h1>
    </>
  )
}

export default App
