import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import threedot from "../overview/threedot.css"

import { Oval } from 'react-loader-spinner';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function Machine({ title, subheader, ...other }) {

  const [ edit, setEdit ] = useState(false);
  const [ status, setStatus ] = useState("Offline");
  const [ ip , setIp ] = useState("192.168.17.137");
  const [ os, setOs ] = useState("Ubuntu");
  const [ lastOnline, setLastOnline ] = useState("4/3/2024")
  const [ waitStart, setWaitStart ] = useState(false);
  const [ waitPing, setWaitPing ] = useState(false);
  const [ waitInstall, setWaitInstall ] = useState(false);
  const [ waitEnter, setWaitEnter ] = useState(false);
  const [ statusMessage, setStatusMessage ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ error, setError] = useState(false); 
  const [ isOnline, setIsOnline ] = useState(false);

  const statusMessages = ["Validating VMX file...","Starting Vritual Machine...","Stoping Virtual Machine..."]
  const errorMessages = ["Invalid VMX Path","VM not running"]

  const handleEdit = () => {
    if (!edit) setEdit(true);
    if (edit) setEdit(false);
    
  }

  const handleStart = () => {
    setError(false);
    setErrorMessage("");
    const sse = new EventSource('http://localhost:5005/start_vm?vmx_path='+subheader);
    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      if (data.status === "VALIDATING_VMX"){
        setStatusMessage(statusMessages[0]);
        setWaitStart(true);
      }
      if (data.status === "INVALID_VMX"){
        setWaitStart(false);
        setError(true);
        setErrorMessage(errorMessages[0]);
        sse.close();
      }
      if (data.status === "STARTING_VM"){
        setStatusMessage(statusMessages[1]);
        console.log("sssdd")
      }
      if (data.status === "VM_STARTED") {
        setWaitStart(false);
        setIsOnline(true);
        sse.close();
      }
    }
  }

  const handleStop = () => {  
    setError(false);
    setErrorMessage("");
    const sse = new EventSource('http://localhost:5005/stop_vm?vmx_path='+encodeURIComponent(subheader))
    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      if (data.status === "INVALID_VMX"){
        setWaitStart(false);
        setError(true);
        setErrorMessage(errorMessages[0]);
        sse.close();
      }
      if (data.status === "NOT_RUNNING"){
        setWaitStart(false);
        setError(true);
        setIsOnline(false); 
        setErrorMessage(errorMessages[1])
        sse.close();
      }
      if (data.status === "STOPING_VM"){
        setStatusMessage(statusMessages[2]);
      }
      if (data.status == "VM_STOPPED"){
        setWaitStart(false);
        setIsOnline(false);
        sse.close();
      }
    }
  }

  const subheaderCmpnt = (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
      {subheader}
      {edit && <svg style={{ cursor: "pointer", marginLeft: 4, width: "2em", height: "2em", paddingRight: 4}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>}
    </div>
  )

  return (

    <Card {...other}>
      <Box sx={{ alignItems: "center", pb: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <div style={{ marginTop: 4,  alignItems: "center", display: "flex", flexDirection: "row" }}>
          <img style={{ marginTop: 12, marginLeft: 12, width: "4em", height: "4em" }} alt="icon" src="/assets/icons/glass/ic_ubuntu.png" />
          <CardHeader  title={title} subheader={subheaderCmpnt} />
        </div>
        <Button sx={{ marginRight: 4}}>
          <svg style={{ width: "2em", height: "2em", paddingRight: 4}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </Button>
      </Box>
      <Card sx={{ border: !isOnline ? "1px solid red" : "1px solid green", justifyContent: "space-around", display: 'flex', flexDirection: 'row', backgroundColor: "#D3D3D3", marginLeft: 4, marginRight: 4, marginTop: 2, padding: 2, }}>
        <Stack sx={{marginRight: 4}} spacing={0.5}>
          <Typography variant="h6">Status</Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            {status}
          </Typography>
        </Stack>
        <Stack sx={{marginRight: 4}} spacing={0.5}>
          <Typography variant="h6">IP Address</Typography>
          {!edit && <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            {ip}
          </Typography>}
          {edit && <TextField sx={{padding: 0}} value={ip} onChange={ev =>setIp(ev.target.value)} id="outlined-search" type="search" />}
        </Stack>
        <Stack sx={{marginRight: 4}} spacing={0.5}>
          <Typography variant="h6">Operating System</Typography>
          {!edit && <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            {os}
          </Typography>}
          {edit && <TextField id="outlined-search" value={os} onChange={ev => setOs(ev.target.value)} type="search" />}
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="h6">Last Online</Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            {lastOnline}
          </Typography>
        </Stack>
      </Card>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <Box>
          {!isOnline && <Button onClick={handleStart} sx={{ margin: 2 }}> 
            {!waitStart && <svg style={{ marginRight: 1, width: "1.5em", height: "1.5em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>}
            {waitStart && <Oval
              sx={{ marginRight: 2}}
              height="1.5em"
              width="1.5em"
              color="#4fa94d"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />}
            Start
          </Button>}
          {isOnline && <Button onClick={handleStop} sx={{ margin: 2 }}> 
            {!waitStart && <svg style={{ marginRight: 1, width: "1.5em", height: "1.5em" }}  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
            </svg>
            }
            {waitStart && <Oval
              sx={{ marginRight: 2}}
              height="1.5em"
              width="1.5em"
              color="#4fa94d"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />}
            Stop
          </Button>}
          <Button sx={{ margin: 2 }}>
            <svg style={{ marginRight: 1, width: "1.5em", height: "1.5em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            Ping
          </Button>
          <Button sx={{ margin: 2 }} onClick={handleEdit}>
            <svg style={{ marginRight: 1, width: "1.5em", height: "1.5em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Edit
          </Button>
        </Box>
        {waitStart && <h4 className='loading'>{statusMessage}</h4>}
        {error && <h4 style={{color: "red"}}>{errorMessage}</h4>}
        <Box>
          <Button sx={{ margin: 2 }}>
            <svg style={{ marginRight: 1, width: "1.5em", height: "1.5em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Enter
          </Button>
          <Button sx={{ margin: 2 }}>
            <svg style={{ marginRight: 1, width: "1.5em", height: "1.5em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
            </svg>
            Install Tools
          </Button>
          <Button sx={{ margin: 2 }} onClick={handleEdit}>
            <svg style={{ marginRight: 1, width: "1.5em", height: "1.5em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
            </svg>
            Utilities
          </Button>
        </Box>
      </Box>
    </Card>
    
  );
}
Machine.propTypes = {
  subheader: PropTypes.string,
  title: PropTypes.string,
};
