import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function AppWidgetRun({ color = 'primary', sx, ...other }) {
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
          <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </Box>

      <Stack spacing={0.5}>
        <Typography variant="h4">Execute</Typography>

        <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          Run a program in Guest OS
        </Typography>
      </Stack>
    </Card>
  );
}

AppWidgetRun.propTypes = {
  color: PropTypes.string,
  sx: PropTypes.object,
};
