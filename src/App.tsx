import { AppBar, Stack, Toolbar } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';
import EndDateSelector from './components/EndDateSelector';
import InstructionsDialog from './components/InstructionsDialog';
import ThemeModeSelector from './components/ThemeModeSelector';
import TrackerRows from './components/TrackerRows';
import UploadButton from './components/UploadDialog';
import CustomMuiThemeProvider from './theme/CustomMuiThemeProvider';
import { MonthGroup } from './utils/parseTimeData';

// function Copyright() {
//   return (
//     <Typography
//       variant="body2"
//       align="center"
//       sx={{
//         color: 'text.secondary',
//         mt: 4,
//       }}
//     >
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}.
//     </Typography>
//   );
// }

export default function App() {
  const [data, setData] = useState<MonthGroup[]>([]);
  const [isDataParsed, setIsDataParsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetData = (parsedData: MonthGroup[]) => {
    setData(parsedData);
    setIsDataParsed(true);
  };

  const trackerRowsProps = {
    data,
    isDataParsed,
    isLoading,
    handleSetData,
    setIsLoading,
  };

  const uploadButtonProps = {
    handleSetData,
    setIsLoading,
    isLoading,
  };

  return (
    <CustomMuiThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AppBar position="static" color="primary">
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Flextime Tracker
              </Typography>
              <Stack direction="row" spacing={2}>
                {isDataParsed && <UploadButton {...uploadButtonProps} />}
                {isDataParsed && <InstructionsDialog />}
                <ThemeModeSelector />
              </Stack>
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <EndDateSelector />
            <TrackerRows {...trackerRowsProps} />
            {/* <Copyright /> */}
          </Box>
        </Container>
      </LocalizationProvider>
    </CustomMuiThemeProvider>
  );
}
