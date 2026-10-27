import { differenceInCalendarDays } from "date-fns";
import type { IsoDate, PeriodRecord } from "@/types/period";
import { fromIsoDate } from "./date";

// IsoDate는 사전순 비교가 곧 날짜순 비교다.

export const sortRecords = (records: PeriodRecord[]) =>
  [...records].sort((a, b) => a.startDate.localeCompare(b.startDate));

export const getPeriodLength = (record: PeriodRecord) =>
  differenceInCalendarDays(
    fromIsoDate(record.endDate),
    fromIsoDate(record.startDate),
  ) + 1;

export const findRecordContaining = (records: PeriodRecord[], date: IsoDate) =>
  records.find((r) => r.startDate <= date && date <= r.endDate);
