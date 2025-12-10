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
import { lighten, useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import MdxInstructions from '../content/instructions.mdx';
import mdxComponents from '../utils/mdxComponents';
import { useStore } from '../store/zustand';
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
  const theme = useTheme();
  const smtoAnnualLimit = useStore((s) => s.smtoAnnualLimitHours);
  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={!isDataParsed && !isLoading}>
        <Box sx={{ p: 3 }}>
          <ExcelUploader onDataParsed={handleSetData} setIsLoading={setIsLoading} />
          <MdxInstructions components={mdxComponents} />
        </Box>
      </Collapse>
      <Collapse in={isDataParsed && !isLoading}>
        {data.map(({ month, entries, summary }, i) => {
          const { flextimeYTD, vacationTimeYTD } = summary;
          const vacationTimeRemaining = Math.max(smtoAnnualLimit - vacationTimeYTD, 0);
          const smtoRemainingColor = lighten(theme.palette.secondary.main, 0.3);
          const headerMetrics = [
            {
              label: `${flextimeYTD} hrs Flextime Remaining`,
              color: theme.palette.info.main,
            },
            {
              label: `${vacationTimeRemaining} hrs SMTO Remaining`,
              color: smtoRemainingColor,
            },
          ];
          return (
            <Accordion key={dayjs(month).format('YYYY-MM-DD')} defaultExpanded={i === 0}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                  <Typography component="span" variant="h4">
                    {dayjs(month).format('MMMM YYYY')}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      ml: 'auto',
                    }}
                  >
                    {headerMetrics.map(({ label, color }) => (
                      <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 6, height: 24, borderRadius: 1, backgroundColor: color }} />
                        <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap', color }}>
                          {label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                <EnhancedDateCalendar entries={entries} month={dayjs(month)} summary={summary} />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Collapse>
    </Box>
  );
}
