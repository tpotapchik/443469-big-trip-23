import {DateFormat} from '../constants.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

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
    return updatedDateDelta.format(DateFormat.DAY);
  }

  if (updatedDateDelta.hours() > 0) {
    return updatedDateDelta.format(DateFormat.HOURS);
  }

  return updatedDateDelta.format(DateFormat.MINUTES);
};

const displayDateMonth = (date) => date ? dayjs(date).format(DateFormat.DATE_MONTH) : '';
const displayDate = (date) => date ? dayjs(date).format(DateFormat.DATE) : '';
const displayTime = (time) => time ? dayjs(time).format(DateFormat.TIME) : '';
const displayDateTime = (date, dateFormat = DateFormat.DATE_TIME_SYSTEM) => date ? dayjs(date).format(dateFormat) : '';

export {calculateDuration, displayDateMonth, displayDate, displayTime, displayDateTime, DateFormat};
