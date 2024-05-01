import { faker } from '@faker-js/faker';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import AppTasks from '../app-tasks';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import Machine from '../app-machine';

import AppWidgetListVMs from '../app-widget-list-vms';
import AppWidgetDir from '../app-widget-dir';
import AppWidgetRun from '../app-widget-run';
import AppWidgetImport from '../app-widget-import';


import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Your Machines
      </Typography>

      <Grid container spacing={3} sx={{display: "flex", alignItems: "stretch"}}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetListVMs/>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetImport/>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetRun/>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetDir/>
        </Grid>

        <Grid xs={12} md={6} lg={12}>
          <Machine
            title="Ubuntu-Server 20.04"
            subheader="D:\metasploitable\metasploitable-linux-2.0.0\Metasploitable2-Linux\Metaspoitable.vmx"
          />
        </Grid>
        <Grid xs={12} md={6} lg={12}>
          <Machine
            title="Ubuntu-Server 20.04"
            subheader="C:\Users\darra\OneDrive\Documents\ubuntu.vmx"
          />
        </Grid>
        <Grid xs={12} md={6} lg={12}>
          <Machine
            title="Ubuntu-Server 20.04"
            subheader="C:\Users\darra\OneDrive\Documents\ubuntu.vmx"
          />
        </Grid>
      </Grid>
    </Container>
  );
}
