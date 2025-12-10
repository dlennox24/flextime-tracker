import dayjs, { Dayjs } from 'dayjs';
import { create } from 'zustand';
import { DaysOfWeekType_ddd } from '../types/Date';

export type SmtoLimitOption = 'less-than-one-year' | 'more-than-one-year';

const smtoLimitHoursByOption: Record<SmtoLimitOption, number> = {
  'less-than-one-year': 80,
  'more-than-one-year': 168,
};

export type StoreValuesType = {
  workdayHours: number;
  weekends: DaysOfWeekType_ddd[];
  endDate: Dayjs;
  smtoLimitOption: SmtoLimitOption;
  smtoAnnualLimitHours: number;
};

export type StoreFunctionsType = {
  resetEndDate: () => void;
  updateEndDate: (endDate: Dayjs) => void;
  updateSmtoLimitOption: (option: SmtoLimitOption) => void;
};

export type StoreType = StoreValuesType & StoreFunctionsType;

const currentDate = dayjs();
const defaultSmtoOption: SmtoLimitOption = 'less-than-one-year';

export const useStore = create<StoreType>((set) => ({
  workdayHours: 8,
  weekends: ['Sat', 'Sun'],
  endDate: currentDate,
  smtoLimitOption: defaultSmtoOption,
  smtoAnnualLimitHours: smtoLimitHoursByOption[defaultSmtoOption],
  resetEndDate: () => set({ endDate: currentDate }),
  updateEndDate: (endDate: Dayjs) => set({ endDate }),
  updateSmtoLimitOption: (option: SmtoLimitOption) =>
    set({
      smtoLimitOption: option,
      smtoAnnualLimitHours: smtoLimitHoursByOption[option],
    }),
}));

export const smtoLimitOptions = [
  { label: 'Less than one year', value: 'less-than-one-year' as const, hours: 80 },
  { label: 'More than one year', value: 'more-than-one-year' as const, hours: 168 },
];
