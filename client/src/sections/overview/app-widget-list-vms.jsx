import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Oval } from 'react-loader-spinner';

import { fShortenNumber } from 'src/utils/format-number';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export default function AppWidgetListVMs({ color = 'primary', sx, ...other }) {
  
  const [socketState, setSocketState] = useState("");
  const [waiting, setWaiting] = useState(false);

  const handleClick = () => {
    console.log('clicked')
    const sse = new EventSource('http://localhost:5002/list_vms');

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      if (data.status === "STARTING_LIST_VMS"){
        setWaiting(true);
      }
      if (data.status === "COMPLETED_LIST_VMS") {
        console.log("completed")
        setWaiting(false);
        sse.close();
      }
    }


  }

  return (
    <Card
      onClick={handleClick}
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        px: 3,
        py: 5,
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: 50, height: 50 }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
          </svg>
        </Box>

        <Stack spacing={0.5}>
          <Typography variant="h4">List VMs</Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          List all running machines
          </Typography>
        </Stack>
      </Box>
      {waiting && <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Oval
          height="40"
          width="40"
          color="#4fa94d"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </Box>}
    </Card>
  );
}

AppWidgetListVMs.propTypes = {
  color: PropTypes.string,
  sx: PropTypes.object,
};
