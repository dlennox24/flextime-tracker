import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Collapse,
  Divider,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import MdxInstructions from '../content/instructions.mdx';
import mdxComponents from '../utils/mdxComponents';
import { MonthGroup } from '../utils/parseTimeData';
import EnhancedDateCalendar from './EnhancedDateCalendar';
import ExcelUploader from './ExcelUploader';

export default function TrackerRows({
  data,
  isDataParsed,
  isLoading,
  handleSetData,
  setIsLoading,
}: {
  data: MonthGroup[];
  isDataParsed: boolean;
  isLoading: boolean;
  handleSetData: (data: MonthGroup[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}) {
  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={!isDataParsed && !isLoading}>
        <Box sx={{ p: 3 }}>
          <ExcelUploader onDataParsed={handleSetData} setIsLoading={setIsLoading} />
          <MdxInstructions components={mdxComponents} />
        </Box>
      </Collapse>
      <Collapse in={isDataParsed && !isLoading}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {data.map(({ month, entries, summary }, i) => {
            return (
              <Accordion key={dayjs(month).format('YYYY-MM-DD')} defaultExpanded={i === 0}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography component="span" variant="h4">
                    {dayjs(month).format('MMMM YYYY')}
                  </Typography>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                  <EnhancedDateCalendar entries={entries} month={dayjs(month)} summary={summary} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </LocalizationProvider>
      </Collapse>
    </Box>
  );
}
