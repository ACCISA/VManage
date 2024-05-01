import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useRef, useState } from 'react';
import AppPopupImport from './popup/app-popup-import';

// ----------------------------------------------------------------------

export default function AppWidgetImport({ color = 'primary', sx, ...other }) {
  
  const inputRef = useRef(null);
  
  const [ vmxPath, setVmxPath ] = useState("");
  const [ open, setOpen ] = useState(false);

  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("filke change")
    if (file) {
      console.log("file choosen")
      setVmxPath(file.name)
      const sse = new EventSource("http://localhost:5005/start_import?vmx_path="+file.name)

      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data)
        if (data.status == "VALIDATING_VMX"){
          console.log("validating")
        }
        if (data.status == "INVALID_VMX"){
          console.log("invalid vmx")
        }
        if (data.status == "CHECKING_VM"){
          console.log("checking vm")
        }
        if (data.status == "FOUND_VM"){
          console.log("found stored vm")
        }
        if (data.status == "STARTING_VM"){
          console.log("starting vm")
        }
        if (data.status == "VM_STARTED"){
          console.log("vm started")
          sse.close();
        } 
      }
    }
    event.target.value = "";
  };

  const handleCardClick = () => {
    setOpen(true);
  }

  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        cursor: "pointer",
        px: 3,
        py: 5,
        borderRadius: 2,
        ...sx,
      }}
      {...other}
      onClick={handleCardClick}
    > 
  
      <input accept=".vmx" onChange={handleFileChange} type="file" style={{display: "none"}} />
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: 50, height: 50 }}>
        <svg style={{width:50, height:50}} className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
        </svg>
      </Box>

      <Stack spacing={0.5}>
        <Typography variant="h4">Import</Typography>

        <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          Import a vm from vmx
        </Typography>
      </Stack>
      <AppPopupImport open={open} setOpen={setOpen}/>
    </Card>
  );
}

AppWidgetImport.propTypes = {
  color: PropTypes.string,
  sx: PropTypes.object,
};
