import dayjs, { Dayjs } from 'dayjs';
import { create } from 'zustand';
import { DaysOfWeekType_ddd } from '../types/Date';

export type StoreValuesType = {
  workdayHours: number;
  weekends: DaysOfWeekType_ddd[];
  endDate: Dayjs;
};

export type StoreFunctionsType = {
  resetEndDate: () => void;
  updateEndDate: (endDate: Dayjs) => void;
};

export type StoreType = StoreValuesType & StoreFunctionsType;

const currentDate = dayjs();
export const useStore = create<StoreType>((set) => ({
  workdayHours: 8,
  weekends: ['Sat', 'Sun'],
  endDate: currentDate,
  resetEndDate: () => set({ endDate: currentDate }),
  updateEndDate: (endDate: Dayjs) => set({ endDate }),
}));
