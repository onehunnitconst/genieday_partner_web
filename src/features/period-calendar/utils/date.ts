import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import type { IsoDate } from "@/types/period";

export const toIsoDate = (date: Date): IsoDate => format(date, "yyyy-MM-dd");

export const fromIsoDate = (iso: IsoDate): Date => parseISO(iso);

export const formatMonthLabel = (date: Date) =>
  format(date, "yyyy년 M월", { locale: ko });

export const formatDayLabel = (iso: IsoDate) =>
  format(fromIsoDate(iso), "M월 d일 (EEE)", { locale: ko });

export const formatShortDate = (iso: IsoDate) =>
  format(fromIsoDate(iso), "M월 d일", { locale: ko });

