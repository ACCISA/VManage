import axios from 'axios'
import { useState } from 'react';

function App() {

  const [statusAPI, setStatusAPI] = useState("");
  const [name, setName] = useState("VM Name");
  const [path, setPath] = useState("VM Path");
  const [ip, setIp] = useState("VM IP");
  const [launchName, setLaunchName] = useState()

  const handleLaunchVM = (ev) => {
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
            console.log("vm online");
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

  return (
    <>
      <div className='flex justify-center content-center'>
        <h1 className='bg-red-500'>Add VM</h1>
        <form onSubmit={handleAddVM} className='flex flex-col bg-red-500'>
          <input type="text" value={name} onChange={ev => setName(ev.target.value)} />
          <input type="text" value={path} onChange={ev => setPath(ev.target.value)} />
          <input type="text" value={ip} onChange={ev => setIp(ev.target.value)} />
          <input type="submit" />
        </form>

        <form onSubmit={handleLaunchVM}>
          <input type="text" value={launchName} onChange={ev => setLaunchName(ev.target.value)} />
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
