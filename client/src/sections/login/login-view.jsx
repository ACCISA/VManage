import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from "axios";
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { bgGradient } from 'src/theme/css';
import { login } from 'src/redux/machinesSlice';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ invalidLogin, setInvalidLogin ] = useState(false);

  const handleLogin = () => {
    axios.post("http://localhost:5005/auth",{username, password})
    .then((res) => {
      if (res.data.status != true){
        setInvalidLogin(true);
        return
      }
      const machines = res.data.machines;
      dispatch(login(machines))
      navigate('/');

      
    })
    .catch((err) => {
      setInvalidLogin(true);
    })
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="text" label="Username" value={username} onChange={(ev) => setUsername(ev.target.value) } />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      {invalidLogin && <Stack direction="row" alignItems="center" justifyContent="center" sx={{ my: 2, color: "red"}}>
          Invalid Credentials
      </Stack>}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleLogin}
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" sx={{marginBottom: "1em"}}>Sign in to VManage</Typography>
          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
