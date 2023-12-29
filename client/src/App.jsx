import axios from 'axios'
import { useState } from 'react';
import Header from './Header';
import VMComponent from './VMComponent';
import './Test.css';


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
    <Header></Header>
    <VMComponent></VMComponent>
    <VMComponent></VMComponent>
    </>
  )
}

export default App
