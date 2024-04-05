import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function AppWidgetNetwork({ color = 'primary', sx, ...other }) {
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
        </svg>

      </Box>

      <Stack spacing={0.5}>
        <Typography variant="h4">Networking</Typography>

        <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          List/Add/Delete a port forwarding
        </Typography>
      </Stack>
    </Card>
  );
}

AppWidgetNetwork.propTypes = {
  color: PropTypes.string,
  sx: PropTypes.object,
};
