import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { setMessage } from "../utils/notification";
import { Store } from "react-notifications-component";

export default function VMCard({vm_name, vm_path, vm_ip, vm_os, vm_status}) {

    const [status, setStatus] = useState(vm_status);
    const [isRunning, setIsRunning] = useState((vm_status == "VM_OFFLINE") ? false : true);
    const [bgStatus, setBgStatus] = useState("bg-red-600");
    
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
    
      const handleGetIP = () => {
        axios.post("/getip",{
          "name": vm_name
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(res => {
          
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
    <Box
      className="p-20"
      sx={{
        width: '100%',
        position: 'relative',
        overflow: { xs: 'auto', sm: 'initial' },
      }}
    >
      <Card
        orientation="horizontal"
        sx={{
          width: '100%',
          flexWrap: 'wrap',
          [`& > *`]: {
            '--stack-point': '500px',
            minWidth:
              'clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)',
          },
          // make the card resizable for demo
          overflow: 'auto',
          resize: 'horizontal',
        }}
      >
        
        <CardContent>
          <Typography fontSize="xl" fontWeight="lg">
            {vm_name}
          </Typography>
          <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
            {vm_path}
          </Typography>
          <Sheet
            sx={{
              bgcolor: 'background.level1',
              borderRadius: 'sm',
              p: 1.5,
              my: 1.5,
              display: 'flex',
              gap: 2,
              '& > div': { flex: 1 },
            }}
          >
            <div>
              <Typography level="body-xs" fontWeight="lg">
                IP
              </Typography>
              <Typography fontWeight="lg">{vm_ip}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Status
              </Typography>
              <Typography fontWeight="lg">{vm_status}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Last Online
              </Typography>
              <Typography fontWeight="lg">Today</Typography>
            </div>
          </Sheet>
          <Box sx={{ display: 'flex', gap: 4, '& > button': { flex: 1 } }}>
            <Button variant="outlined" color="neutral" onClick={handleRemoveVM}>
              Remove
            </Button>
           <Button variant="outlined" color="neutral" onClick={handleEditVM}>
              Edit
            </Button>
            <Button variant="solid" color="primary" onClick={handlePingVM}>
              Ping
            </Button>
            <Button variant="solid" color="primary" onClick={handleStartStopVM}>
                {isRunning ? 'Stop' : 'Start'}  
            </Button>
            <Button variant="solid" color="primary" onClick={handleGetIP}>
              Get IP
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}