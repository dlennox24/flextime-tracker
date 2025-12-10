import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { smtoLimitOptions, SmtoLimitOption, useStore } from '../store/zustand';

export default function EndDateSelector() {
  const endDate = useStore((s) => s.endDate);
  const handleUpdateEndDate = useStore((s) => s.updateEndDate);
  const smtoLimitOption = useStore((s) => s.smtoLimitOption);
  const handleUpdateSmtoLimitOption = useStore((s) => s.updateSmtoLimitOption);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
      <DatePicker
        sx={{ flex: 1, maxWidth: 160 }}
        label="End Date"
        value={endDate}
        onChange={(newValue: Dayjs | null) => {
          if (newValue) {
            handleUpdateEndDate(newValue);
          }
        }}
      />
      <FormControl sx={{ minWidth: 240 }}>
        <InputLabel id="smto-limit-label">Time Employed</InputLabel>
        <Select
          labelId="smto-limit-label"
          label="Time Employed"
          value={smtoLimitOption}
          onChange={(event) =>
            handleUpdateSmtoLimitOption(event.target.value as SmtoLimitOption)
          }
        >
          {smtoLimitOptions.map(({ label, value, hours }) => (
            <MenuItem key={value} value={value}>{`${label} (${hours} hrs)`}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
