import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import {
  Box,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import { PaletteColor, styled, useTheme } from '@mui/material/styles';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';
import { DailySum, MonthlySum } from '../utils/parseTimeData';

type ChipColor = ChipProps['color'];

interface EnhancedDateCalendarProps {
  entries: DailySum[];
  month: Dayjs; // Month to display (e.g., dayjs('2025-06'))
  summary: MonthlySum;
}

function getEntryMap(entries: DailySum[]): Record<string, DailySum> {
  return entries.reduce((acc, entry) => {
    const key = dayjs(entry.date).format('YYYY-MM-DD');
    acc[key] = { ...entry };
    return acc;
  }, {} as Record<string, DailySum>);
}

const blockStyles = {
  width: '6.5rem',
  height: '6.5rem',
};
const StyledCalendar = styled(DateCalendar)(({ theme }) => ({
  '&': {
    overflow: 'initial',
    width: 'initial',
    maxHeight: 'initial',
    display: 'initial',
    flexDirection: 'initial',
    margin: 'initial',
    height: 'initial',
    '.MuiDayCalendar-weekContainer': {
      margin: 0,
      '>.MuiBox-root, .MuiPickersDay-hiddenDaySpacingFiller': {
        border: `1px solid ${theme.palette.divider}`,
        margin: 0,
        marginTop: -1,
        marginLeft: -1,
        marginRight: 0,
        // background: 'orange',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: `calc(${blockStyles.width} - 1px)`,
        height: `calc(${blockStyles.height} - 1px)`,
      },
    },
    '.MuiPickersCalendarHeader-root': {
      display: 'none', // 👈 hides month + arrows
    },
  },
  '& .MuiDayCalendar-header': {
    '>span': {
      borderBottom: `2px solid ${theme.palette.divider}`,
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: 0,
      color: theme.palette.text.primary,
      ...blockStyles,
      height: `calc(${blockStyles.height} * 0.66)`,
    },
  },
}));

function CustomDay(props: PickersDayProps & { entryMap: Record<string, DailySum> }) {
  const theme = useTheme();
  const { day, entryMap, outsideCurrentMonth, ...other } = props;

  const key = day.format('YYYY-MM-DD');
  const { hours: totalHours, isHoliday, isVacationDay, vacationHours } = entryMap[key] ?? {};

  // If it's outside the current month, return a zero-opacity day to keep grid alignment
  if (outsideCurrentMonth) {
    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth
        sx={{ opacity: 0, pointerEvents: 'none' }}
      />
    );
  }

  let background = '';
  switch (day.format('dddd')) {
    case 'Saturday':
    case 'Sunday':
      background = theme.palette.background.paper;
      break;

    default:
      break;
  }

  let chipLabel = 'hour';
  let chipPlusMinus = '';
  let chipColor: ChipColor = 'default';
  if (totalHours > 0) {
    chipLabel += 's';
    chipPlusMinus = '+';
    chipColor = 'success';
  }
  if (totalHours === 0) {
    chipLabel += 's';
    chipPlusMinus = '';
  }
  if (totalHours < 0) {
    chipLabel += 's';
    chipPlusMinus = '';
    chipColor = 'error';
  }

  const iconChipStyles = {
    width: 26,
    height: 26,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    '& .MuiChip-label': {
      display: 'none',
    },
    '& .MuiSvgIcon-root': {
      m: 0,
      height: '17px',
      width: '17px',
    },
  };

  return (
    <Box sx={{ background }}>
      <Box
        sx={{
          width: `calc(${blockStyles.width} - 0.75rem)`,
          height: `calc(${blockStyles.height} - 0.75rem)`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PickersDay
            {...other}
            day={day}
            outsideCurrentMonth={false}
            sx={{
              '&:hover, &:focus, &:active': { background: 'none' },
              cursor: 'initial',
              fontSize: '1.15rem',
            }}
            disableRipple
            disableTouchRipple
            disableHighlightToday
            disableMargin
          ></PickersDay>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            {isVacationDay && (
              <Tooltip
                title={`Used ${vacationHours} hour${Math.abs(vacationHours) === 1 ? '' : 's'} SMTO`}
              >
                <Chip
                  icon={<BeachAccessIcon />}
                  size="small"
                  sx={iconChipStyles}
                  color="secondary"
                />
              </Tooltip>
            )}
            {isHoliday && (
              <Tooltip title="Paid Holiday">
                <Chip
                  icon={<AccountBalanceIcon />}
                  size="small"
                  sx={iconChipStyles}
                  color="primary"
                />
              </Tooltip>
            )}
          </Box>
        </Box>
        <Container
          disableGutters
          sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          {(totalHours || totalHours === 0) && (
            <Chip
              label={`${chipPlusMinus}${totalHours} ${chipLabel}`}
              color={chipColor}
              variant="outlined"
            />
          )}
        </Container>
      </Box>
    </Box>
  );
}

const StyledListItem = ({
  primary,
  secondary,
  color,
}: {
  primary: string;
  secondary: string;
  color: PaletteColor;
}) => {
  const theme = useTheme();
  return (
    <ListItem
      sx={{ borderLeft: `6px solid ${color[theme.palette.mode]}`, mb: 3, pl: 2 }}
      disablePadding
    >
      <ListItemText
        primary={primary}
        secondary={secondary}
        slots={{
          primary: ({ children }) => (
            <Typography variant="h5" component="span" sx={{ color: color.main }}>
              {children}
            </Typography>
          ),
          secondary: ({ children }) => (
            <Typography sx={{ fontWeight: 'normal' }}>{children}</Typography>
          ),
        }}
      />
    </ListItem>
  );
};

export default function EnhancedDateCalendar({
  entries,
  month,
  summary,
}: EnhancedDateCalendarProps) {
  const theme = useTheme();
  const entryMap = React.useMemo(() => getEntryMap(entries), [entries]);
  const { flextimeAccrued, flextimeUsed, vacationTimeUsed, flextimeYTD } = summary;

  const listItemHours = [
    {
      primaryText: `${flextimeYTD} hour${Math.abs(flextimeYTD) === 1 ? '' : 's'}`,
      secondaryText: 'Flextime Remaining (Year to Date)',
      color: theme.palette.info,
    },
    {
      primaryText: `+${flextimeAccrued} hour${Math.abs(flextimeAccrued) === 1 ? '' : 's'}`,
      secondaryText: 'Flextime Accrued',
      color: theme.palette.success,
    },
    {
      primaryText: `-${flextimeUsed} hour${Math.abs(flextimeUsed) === 1 ? '' : 's'}`,
      secondaryText: 'Flextime Used',
      color: theme.palette.error,
    },
    {
      primaryText: `${vacationTimeUsed} hour${Math.abs(vacationTimeUsed) === 1 ? '' : 's'}`,
      secondaryText: 'SMTO Time Used',
      color: theme.palette.secondary,
    },
  ];

  return (
    <Grid container>
      <Grid size="auto" spacing={2}>
        <List>
          {listItemHours.map(({ primaryText, secondaryText, color }) => (
            <StyledListItem
              key={secondaryText}
              primary={primaryText}
              secondary={secondaryText}
              color={color}
            />
          ))}
        </List>
      </Grid>
      <Grid
        size="grow"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <StyledCalendar
          value={null}
          referenceDate={month}
          reduceAnimations
          slots={{
            day: (props) => <CustomDay {...props} entryMap={entryMap} />,
          }}
        />
      </Grid>
    </Grid>
  );
}
