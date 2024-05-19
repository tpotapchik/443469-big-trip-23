import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

const DateFormats = {
  DATE_MONTH: 'MMM D',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATE_TIME_SYSTEM: 'YYYY-MM-DDTHH:mm',
  DATE_TIME: 'DD/MM/YY HH:mm',
  DAY: 'DD[d] HH[h] mm[m]',
  HOURS: 'HH[h] mm[m]',
  MINUTES: 'mm[m]'
};

const calculateDuration = (dateFrom, dateTo) => {
  const dateDelta = dayjs.duration(dayjs(dateTo).diff(dateFrom));

  const totalMonths = dateDelta.months() + dateDelta.years() * 12;
  const totalDays = dayjs(dateFrom).add(totalMonths, 'months').diff(dayjs(dateFrom), 'days');

  const updatedDateDelta = dayjs.duration({
    days: totalDays,
    hours: dateDelta.hours(),
    minutes: dateDelta.minutes()
  });

  if (updatedDateDelta.days() > 0) {
    return updatedDateDelta.format(DateFormats.DAY);
  }

  if (updatedDateDelta.hours() > 0) {
    return updatedDateDelta.format(DateFormats.HOURS);
  }

  return updatedDateDelta.format(DateFormats.MINUTES);
};

const displayDateMonth = (date) => date ? dayjs(date).format(DateFormats.DATE_MONTH) : '';
const displayDate = (date) => date ? dayjs(date).format(DateFormats.DATE) : '';
const displayTime = (time) => time ? dayjs(time).format(DateFormats.TIME) : '';
const displayDateTime = (date, dateFormat = DateFormats.DATE_TIME_SYSTEM) => date ? dayjs(date).format(dateFormat) : '';

export {calculateDuration, displayDateMonth, displayDate, displayTime, displayDateTime, DateFormats};
