/** 시간대 영향을 받지 않도록 날짜는 "yyyy-MM-dd" 문자열로 다룬다. */
export type IsoDate = string;

export type PeriodRecord = {
  id: string;
  startDate: IsoDate;
  endDate: IsoDate;
};
