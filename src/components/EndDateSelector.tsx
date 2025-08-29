import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { useStore } from '../store/zustand';

export default function EndDateSelector() {
  const endDate = useStore((s) => s.endDate);
  const handleUpdateEndDate = useStore((s) => s.updateEndDate);

  return (
    <DatePicker
      sx={{ mb: 2 }}
      label="End Date"
      value={endDate}
      onChange={(newValue: Dayjs | null) => {
        if (newValue) {
          handleUpdateEndDate(newValue);
        }
      }}
    />
  );
}
