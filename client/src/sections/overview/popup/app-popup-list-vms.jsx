import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import { Oval } from 'react-loader-spinner';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';

export default function AppPopupListVms({open, setOpen, waiting, machines}) {

    const handleClose = () => setOpen(false);
    
    const [ edit, setEdit ] = useState(false);
    const [ ip , setIp ] = useState("192.168.17.137");
    const [ os, setOs ] = useState("Ubuntu");

    const handleEdit = () => {
        if (!edit) setEdit(true);
        if (edit) setEdit(false);
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "50%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    };

    
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {waiting && <Typography sx={{marginBottom: 4}} id="modal-modal-title" variant="h3" component="h2">
                    <h4 className='loading'>Listing Running VMs...</h4>
                </Typography>}
                {!waiting && <Typography sx={{marginBottom: 4}} id="modal-modal-title" variant="h3" component="h2">
                    Listing Running VMs
                </Typography>}
                {waiting && <Oval
                    sx={{ marginRight: 2}}
                    height="3em"
                    width="3em"
                    color="#4fa94d"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />}
                {!waiting && <h4>{machines.length} machine(s) found</h4>}
                {!waiting && machines.map((machine, index) => (
                    <Card sx={{marginBottom: "2em", width: "80%", display: "flex", flexDirection: "row"}}>
                        <Box sx={{width: "80%"}}>
                            <Box sx={{ alignItems: "center", pb: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <div style={{ marginTop: 4,  alignItems: "center", display: "flex", flexDirection: "row" }}>
                                <img style={{ marginTop: 12, marginLeft: 12, width: "4em", height: "4em" }} alt="icon" src="/assets/icons/glass/ic_ubuntu.png" />
                                <CardHeader  title={machine.machineName} subheader={machine.vmxPath} />
                                </div>
                            </Box>
                            <Card sx={{ marginBottom: "1em", border: "1px solid gray", justifyContent: "space-around", display: 'flex', flexDirection: 'row', backgroundColor: "#D3D3D3", marginLeft: 4, marginRight: 4, marginTop: 2, padding: 2, }}>
                                <Stack sx={{marginRight: 4}} spacing={0.5}>
                                <Typography variant="h6">IP Address</Typography>
                                {!edit && <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                                    {machine.ip}
                                </Typography>}
                                {edit && <TextField sx={{padding: 0}} value={ip} onChange={ev =>setIp(ev.target.value)} id="outlined-search" type="search" />}
                                </Stack>
                                <Stack sx={{marginRight: 4}} spacing={0.5}>
                                <Typography variant="h6">Operating System</Typography>
                                {!edit && <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                                    {machine.os}
                                </Typography>}
                                {edit && <TextField id="outlined-search" value={os} onChange={ev => setOs(ev.target.value)} type="search" />}
                                </Stack>
                            </Card>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20%", justifyContent: "space-around" }}>
                            <Button sx={{ fontSize: "1.2em", padding: "1em" }}>Import</Button>
                            <Button sx={{ fontSize: "1.2em", padding: "1em"}} onClick={handleEdit}>
                                <svg style={{ marginRight: 1, width: "1.5em", height: "1.5em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
                                </svg>
                                Edit
                            </Button>
                        </Box>
                    </Card>
                ))}
            </Box>
        </Modal>  
    )

}