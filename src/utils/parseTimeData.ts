import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as XLSX from 'xlsx';
import { StoreValuesType } from '../store/zustand';
import { DaysOfWeekType_ddd } from '../types/Date';

dayjs.extend(isSameOrBefore);

export interface TypeTimeEntry {
  id: number;
  project: string;
  laborCode: string;
  date: Date;
  hours: number;
  notes: string;
}

export interface MonthGroup {
  summary: MonthlySum;
  month: string; // Format: YYYY-MM-01
  entries: DailySum[];
}

export interface DailySum {
  date: string; // Format: 'YYYY-MM-DD'
  hours: number;
  isVacationDay?: boolean;
  vacationHours: number;
  isHoliday?: boolean;
}

export interface MonthlySum {
  month: string; // Format: 'YYYY-MM-01'
  flextimeAccrued: number;
  flextimeUsed: number;
  flextimeYTD: number;
  vacationTimeUsed: number;
}

export function sumMonthlyTime(dailySums: DailySum[], store: StoreValuesType): MonthlySum[] {
  const map = new Map<string, MonthlySum>();

  for (const day of dailySums) {
    const dayDate = dayjs(day.date);
    if (!dayDate.isBefore(store.endDate.endOf('day'))) continue; // skip today and future days

    const monthKey = dayDate.format('YYYY-MM-01');

    if (!map.has(monthKey)) {
      map.set(monthKey, {
        month: monthKey,
        flextimeAccrued: 0,
        flextimeUsed: 0,
        flextimeYTD: 0, // temporary, will be calculated after sorting
        vacationTimeUsed: 0,
      });
    }

    const monthData = map.get(monthKey)!;

    if (day.isVacationDay) {
      monthData.vacationTimeUsed += day.vacationHours ?? 0;
    }

    if (!day.isHoliday) {
      if (day.hours > 0) {
        monthData.flextimeAccrued += day.hours;
      } else if (day.hours < 0) {
        monthData.flextimeUsed += Math.abs(day.hours);
      }
    }
  }

  const sorted = Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));

  // Compute cumulative flextimeYTD (accrued - used)
  let ytdByYear = new Map<string, number>();

  for (const month of sorted) {
    const year = month.month.slice(0, 4);
    const prevYTD = ytdByYear.get(year) ?? 0;
    const netFlex = month.flextimeAccrued - month.flextimeUsed;
    const newYTD = prevYTD + netFlex;
    month.flextimeYTD = newYTD;
    ytdByYear.set(year, newYTD);
  }

  return sorted;
}

function sumEntriesByDay(entries: TypeTimeEntry[], store: StoreValuesType): DailySum[] {
  const vacationDays: Record<string, number> = {};
  const holidays: string[] = [];
  const dailyMap = new Map<string, number>();

  if (entries.length === 0) return [];

  let minDate = dayjs(entries[0].date);
  // let maxDate = dayjs(entries[0].date);

  // First pass: collect totals and metadata
  for (const entry of entries) {
    const dateKey = dayjs(entry.date).format('YYYY-MM-DD');
    const entryDate = dayjs(entry.date);

    if (entryDate.isBefore(minDate)) minDate = entryDate;
    // if (entryDate.isAfter(maxDate)) maxDate = entryDate;

    const currentHours = dailyMap.get(dateKey) ?? 0;
    dailyMap.set(dateKey, currentHours + entry.hours);

    if (!Object.keys(vacationDays).includes(dateKey) && entry.laborCode.includes('SMTO')) {
      vacationDays[dateKey] = entry.hours;
    }
    if (!holidays.includes(dateKey) && entry.laborCode.includes('Holiday')) {
      holidays.push(dateKey);
    }
  }

  // Generate result: fill in all dates between minDate and maxDate
  const result: DailySum[] = [];
  let cursor = minDate.startOf('month');
  // const end = maxDate.isAfter(storeEndDate) ? maxDate.endOf('month') : storeEndDate;

  Object.entries({
    minDate,
    endDate: store.endDate,
    //maxDate,
    //end,
  }).forEach(([key, date]) => console.log(key, date.format('YYYY-MM-DD')));

  // debugger;
  while (cursor.isSameOrBefore(store.endDate)) {
    const date = cursor.format('YYYY-MM-DD');
    console.log(date);
    const day = cursor.format('ddd') as DaysOfWeekType_ddd;
    const isWeekend = store.weekends.includes(day);
    const rawHours = dailyMap.get(date) ?? 0;
    const adjustedHours = isWeekend ? rawHours : rawHours - store.workdayHours;
    const dayDate = dayjs(date);

    if ((!isWeekend && dayDate.isBefore(dayjs().startOf('day'))) || rawHours) {
      result.push({
        date,
        hours: adjustedHours,
        isVacationDay: Object.keys(vacationDays).includes(date),
        vacationHours: vacationDays[date] ?? 0,
        isHoliday: holidays.includes(date),
      });
    }

    cursor = cursor.add(1, 'day');
  }

  // Sort by date ascending
  result.sort((a, b) => a.date.localeCompare(b.date));

  return result;
}

function groupEntriesByMonthDesc(entries: DailySum[], store: StoreValuesType): MonthGroup[] {
  const map = new Map<string, DailySum[]>();

  for (const entry of entries) {
    const [year, month] = entry.date.split('-');
    const key = `${year}-${month}-01`;

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(entry);
  }

  // Generate monthly summaries from all daily entries
  const monthlySummaries = sumMonthlyTime(entries, store);
  const summaryMap = new Map(monthlySummaries.map((s) => [s.month, s]));

  // Construct the grouped MonthGroup[]
  const grouped: MonthGroup[] = [];

  for (const [month, monthEntries] of map.entries()) {
    monthEntries.sort((a, b) => b.date.localeCompare(a.date));

    grouped.push({
      month,
      entries: monthEntries,
      summary: summaryMap.get(month) ?? {
        month,
        flextimeAccrued: 0,
        flextimeUsed: 0,
        vacationTimeUsed: 0,
        flextimeYTD: 0,
      },
    });
  }

  // Sort by month descending
  grouped.sort((a, b) => b.month.localeCompare(a.month));

  return grouped;
}

async function parseXlsDoc(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) {
        reject(new Error('No file data'));
        return;
      }

      try {
        const workbook = XLSX.read(data, { type: 'array' }); // use 'array' with readAsArrayBuffer
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
        }) as string[][];
        resolve(jsonData);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (e) => {
      reject(new Error(`FileReader error: ${e}`));
    };

    reader.readAsArrayBuffer(file); // note: use 'array' as XLSX.read type
  });
}

export default async function parseTimeData(
  file: File,
  store: StoreValuesType
): Promise<MonthGroup[]> {
  let fileData: string[][] = [];
  try {
    fileData = await parseXlsDoc(file);
  } catch (error) {
    throw new Error(`Failed to read TSV file: ${error}`);
  }

  const headers: string[] = fileData.shift() as string[];

  const rawData = fileData.map((values) => {
    const row: Record<string, string> = {};
    headers.forEach((header: string, index) => {
      row[header] = `${values[index]}`;
    });
    return row;
  });

  const data = rawData.map((entry, id) => {
    const hours = parseFloat(entry['Input']);
    let date = new Date(entry['Date']);

    if (
      !entry['Date'] ||
      ['undefined', 'null'].includes(entry['Date']) ||
      date.getFullYear() < 2015 ||
      date.getFullYear() > 2100
    ) {
      console.error(`Failed to parse date in line item`, entry);
      return {};
    }

    return {
      id,
      project: entry['Project'],
      laborCode: entry['Labor Code'],
      date,
      hours,
      notes: entry['Notes'],
    };
  });

  const cleanedData = data.filter((entry) => Object.keys(entry).length > 0) as TypeTimeEntry[];

  const sum = sumEntriesByDay(cleanedData, store);
  return groupEntriesByMonthDesc(sum, store);
}
