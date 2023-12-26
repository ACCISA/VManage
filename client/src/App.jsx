import axios from 'axios'
import { useState } from 'react';

function App() {

  const [statusAPI, setStatusAPI] = useState("");
  const [name, setName] = useState("test");
  const [path, setPath] = useState("D:\\metasploitable\\metasploitable-linux-2.0.0\\Metasploitable2-Linux\\Metasploitable.vmx");
  const [ip, setIp] = useState("192.168.111.222");
  const [launchName, setLaunchName] = useState("test");
  const [vmPath, setVmPath] = useState("C:\\Program Files (x86)\\VMware\\VMware Player\\");
  const [removeName, setRemoveName] = useState("test");


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

  const handleStopVM = (ev) => {
    ev.preventDefault();
    console.log("Attempting to launch VM");
    axios.post('http://localhost:8081/stop',
    {
      "name": launchName
    }, 
    {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res_start => {
      console.log(res_start.data.status);
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
      });
       
    }
  }
  
  const handleAddVM = async (ev) => {
    ev.preventDefault();
    axios.post("http://localhost:8081/add", {
      "name":name,
      "path":path,
      "ip":ip
    })
  }

  const handleRemoveVM = async (ev) => {
    ev.preventDefault();
    axios.post("http://localhost:8081/remove", {
      "name":removeName
    })
    .then(res => {
      console.log(res.data.status)
    })
  }

  const handleSetting = async (ev) => {
    ev.preventDefault();
    axios.post("http://localhost:8081/setting",{
      "vmware_path": vmPath
    })
    .then( res => {
      console.log(res.data.status)
      console.log("setting stored")
    })
  }

  return (
    <>
      <div className='flex justify-center content-center'>
        <h3 className='bg-red-500'>Add VM</h3>
        <form onSubmit={handleAddVM} className='flex flex-col bg-red-500'>
          <input type="text" value={name} onChange={ev => setName(ev.target.value)} />
          <input type="text" value={path} onChange={ev => setPath(ev.target.value)} />
          <input type="text" value={ip} onChange={ev => setIp(ev.target.value)} />
          <input type="submit" />
        </form>

        <h3 className='bg-red-500'>Remove VM</h3>
        <form onSubmit={handleRemoveVM} className='flex flex-col bg-red-500'>
          <input type="text" value={removeName} onChange={ev => setRemoveName(ev.target.value)} />
          <input type="submit" />
        </form>

        <h3 className='bg-red-500'>Start VM</h3>
        <form onSubmit={handleStartVM}>
          <input type="text" value={launchName} onChange={ev => setLaunchName(ev.target.value)} />
          <input type="submit" />
        </form>

        <h3 className='bg-red-500'>Stop VM</h3>
        <form onSubmit={handleStopVM}>
          <input type="text" value={launchName} onChange={ev => setLaunchName(ev.target.value)} />
          <input type="submit" />
        </form>

        <h3 className='bg-red-500'>Settings VM</h3>
        <form onSubmit={handleSetting}>
          <input type="text" value={vmPath} onChange={ev => setVmPath(ev.target.value)} />
          <input type="submit" />
        </form>
        
        <button onClick={handleTestSleep}>
          Test Sleep
        </button>
      </div>
      <h1>{statusAPI}</h1>
    </>
  )
}

export default App
