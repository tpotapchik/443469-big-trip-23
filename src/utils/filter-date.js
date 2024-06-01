import {FilterType} from '../constants.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const isPointFuture = ({dateFrom}) => dayjs().isBefore(dateFrom);
const isPointPresent = ({dateFrom, dateTo}) => dayjs().isAfter(dateFrom) && dayjs().isBefore(dateTo);
const isPointPast = ({dateTo}) => dayjs().isAfter(dateTo);

const filterBy = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

export {filterBy};
