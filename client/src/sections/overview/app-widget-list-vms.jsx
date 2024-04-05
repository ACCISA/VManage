import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function AppWidgetListVMs({ color = 'primary', sx, ...other }) {
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
    >
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
    </Card>
  );
}

AppWidgetListVMs.propTypes = {
  color: PropTypes.string,
  sx: PropTypes.object,
};
