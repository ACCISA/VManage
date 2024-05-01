import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function AppPopupImport({open, setOpen}) {

    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: "flex",
        flexDirection: "column",
    };
    
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Typography sx={{marginBottom: 4}} id="modal-modal-title" variant="h4" component="h2">
                Import Virtual Machine
            </Typography>
            <Box style={{justifyContent: "space-between"}} sx={{display: "flex", flexDirection:"row", justifyContent:"space-between", alignItems: "center"}}>
                <h3 sx={{marginRight: 1}}>Machine Name</h3>
                <TextField
                    hiddenLabel
                    id="filled-hidden-label-small"
                    defaultValue="Small"
                    variant="filled"
                    size="small"
                />
            </Box>
            <Box sx={{ marginTop: 2, display: "flex", flexDirection:"row", justifyContent:"space-between", alignItems: "center"}}>
                <h3 sx={{marginRight: 1}}>VMX Path</h3>
                <TextField
                    hiddenLabel
                    id="filled-hidden-label-small"
                    defaultValue="Small"
                    variant="filled"
                    size="small"
                />
            </Box>
            <Box sx={{ marginTop: 2, display: "flex", flexDirection:"row", justifyContent:"space-between", alignItems: "center"}}>
                <h3 sx={{marginRight: 1}}>IP Address</h3>
                <TextField
                    hiddenLabel
                    id="filled-hidden-label-small"
                    defaultValue="Small"
                    variant="filled"
                    size="small"
                />
            </Box>
            <Box sx={{ marginTop:2, display: "flex", flexDirection:"row", justifyContent:"space-between", alignItems: "center"}}>
                <h3 sx={{marginRight: 1}}>Operating System</h3>
                <TextField
                    hiddenLabel
                    id="filled-hidden-label-small"
                    defaultValue="Small"
                    variant="filled"
                    size="small"
                />
            </Box>
            </Box>
        </Modal>  
    )

}