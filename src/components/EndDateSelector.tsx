import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';
import { useStore } from '../store/zustand';

export default function EndDateSelector() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  const endDate = useStore((s) => s.endDate);
  const handleUpdateEndDate = useStore((s) => s.updateEndDate);

  return (
    <DatePicker
      sx={{ mb: 2 }}
      label="End Date"
      value={endDate}
      onChange={(newValue: Dayjs) => handleUpdateEndDate(newValue)}
    />
  );
}
