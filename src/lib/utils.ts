
import format from 'date-fns/format';
/**
 * @description Format date and time input
 * @param datetime
 * @param addTime
 * @param formatGBInputDate if the input format is in 21-07-2020
 */
export const formatDate = (datetime: Date | string, addTime = false, formatGBInputDate = false): string => {
  if (typeof datetime === "string" && formatGBInputDate) {
    const date = datetime.split('-');
    datetime = new Date(Number(date[2]), Number(date[1])-1, Number(date[0]));
  }

  return (datetime ? format(datetime, addTime && 'MMM D, YYYY hh:mm A' || 'MMM D, YYYY', {
  }) : '')
};
