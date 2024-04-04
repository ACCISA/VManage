import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Button } from '@mui/material';

// ----------------------------------------------------------------------

export default function AppWebsiteVisits({ title, subheader, ...other }) {

  return (

    <Card {...other}>
      
      <Box sx={{ alignItems: "center", pb: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <div style={{ marginTop: 4,  alignItems: "center", display: "flex", flexDirection: "row" }}>
          <img style={{ marginTop: 12, marginLeft: 12, width: "4em", height: "4em" }} alt="icon" src="/assets/icons/glass/ic_ubuntu.png" />
          <CardHeader  title={title} subheader={subheader} />
        </div>
        <Button sx={{ marginRight: 4}}>
          <svg style={{ width: "2em", height: "2em", paddingRight: 4}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </Button>
      </Box>
      <Card sx={{ border: "1px solid red", justifyContent: "space-around", display: 'flex', flexDirection: 'row', backgroundColor: "#D3D3D3", marginLeft: 4, marginRight: 4, marginTop: 2, padding: 2, }}>
        <Stack sx={{marginRight: 4}} spacing={0.5}>
          <Typography variant="h6">IP Address</Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            192.168.17.137
          </Typography>
        </Stack>
        <Stack sx={{marginRight: 4}} spacing={0.5}>
          <Typography variant="h6">Operating System</Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            Ubuntu
          </Typography>
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="h6">Last Online</Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            4/3/2024
          </Typography>
        </Stack>
      </Card>
      <Button sx={{ margin: 2 }}>
        <svg style={{ marginRight: 1, width: "1.5em", height: "1.5em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
        </svg>
        Start
      </Button>
      <Button sx={{ margin: 2 }}>
        <svg style={{ marginRight: 1, width: "1.5em", height: "1.5em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
        Ping
      </Button>
      <Button sx={{ margin: 2 }}>
        <svg style={{ marginRight: 1, width: "1.5em", height: "1.5em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
        Edit
      </Button>

    </Card>
  );
}
AppWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
