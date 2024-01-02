import axios from 'axios'
import { useState } from 'react';
import { Route, Routes } from "react-router-dom"
import Layout from './Layout'; 
import Index from './pages/Index';
import  { RequireAuth }  from "react-auth-kit";
import Login from './pages/Login';
import Add from './pages/Add';

export default function App() {

  const [statusAPI, setStatusAPI] = useState("");
  const [launchName, setLaunchName] = useState("test");
  const [vmPath, setVmPath] = useState("C:\\Program Files (x86)\\VMware\\VMware Player\\");
  const [removeName, setRemoveName] = useState("test");

  axios.defaults.baseURL = "http://localhost:8081";

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

  const handleStopVM = (ev) => {
    ev.preventDefault();
    console.log("Attempting to launch VM");
    axios.post('/stop',
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

      axios.post('/status',
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
  
  const handleRemoveVM = async (ev) => {
    ev.preventDefault();
    axios.post("/remove", {
      "name":removeName
    })
    .then(res => {
      console.log(res.data.status)
    })
  }

  const handleSetting = async (ev) => {
    ev.preventDefault();
    axios.post("/setting",{
      "vmware_path": vmPath
    })
    .then( res => {
      console.log(res.data.status)
      console.log("setting stored")
    })
  }

  return (
    
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RequireAuth loginPath="/login">
          <Index />
        </RequireAuth>} />
        <Route path="/add" element={<RequireAuth loginPath="/login">
          <Add/>
        </RequireAuth>}/>
        <Route path="/login" element={<Login/>}></Route>
      </Route>
    </Routes>

  )
}

