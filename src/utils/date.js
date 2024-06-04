import {DateFormat} from '../constants.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

const calculateDuration = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom).startOf('minute');
  const end = dayjs(dateTo).startOf('minute');
  const differenceInMilliseconds = end.diff(start);
  const eventDuration = dayjs.duration(differenceInMilliseconds);
  const days = Math.floor(eventDuration.asDays());
  const hours = eventDuration.hours();
  const minutes = eventDuration.minutes();

  if (days > 0) {
    return `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else {
    return `${minutes}M`;
  }
};

const displayDateMonth = (date) => date ? dayjs(date).format(DateFormat.DATE_MONTH) : '';
const displayDate = (date) => date ? dayjs(date).format(DateFormat.DATE) : '';
const displayTime = (time) => time ? dayjs(time).format(DateFormat.TIME) : '';
const displayDateTime = (date, dateFormat = DateFormat.DATE_TIME_SYSTEM) => date ? dayjs(date).format(dateFormat) : '';

export {calculateDuration, displayDateMonth, displayDate, displayTime, displayDateTime, DateFormat};
