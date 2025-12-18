import dayjs, { Dayjs } from 'dayjs';
import { create } from 'zustand';
import { DaysOfWeekType_ddd } from '../types/Date';

export type SmtoLimitOption = 'less-than-three-year' | 'more-than-three-year';

const smtoLimitHoursByOption: Record<SmtoLimitOption, number> = {
  'less-than-three-year': 128,
  'more-than-three-year': 168,
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
const defaultSmtoOption: SmtoLimitOption = 'less-than-three-year';

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
  { label: 'Less than 3 years', value: 'less-than-three-year' as const, hours: 128 },
  { label: 'More than 3 years', value: 'more-than-three-year' as const, hours: 168 },
];
