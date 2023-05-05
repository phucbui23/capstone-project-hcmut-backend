import { parse } from 'date-fns';
import { DATE_FORMATS } from 'src/constant/date';

export const getDateAndTime = (str: string): [number, number] => {
  const [hour, minutes, ...rest] = str
    .split(':')
    .map((amount) => parseInt(amount));

  return [hour, minutes];
};

// e.g dateString: "2023-04-23"
export const toDate = (dateString: string): Date => {
  return parse(dateString, DATE_FORMATS.yearMonthDay, new Date());
};
