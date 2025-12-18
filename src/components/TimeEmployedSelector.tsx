import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { smtoLimitOptions, SmtoLimitOption, useStore } from '../store/zustand';

export default function TimeEmployedSelector() {
  const smtoLimitOption = useStore((s) => s.smtoLimitOption);
  const handleUpdateSmtoLimitOption = useStore((s) => s.updateSmtoLimitOption);

  return (
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
  );
}
