import {FilterTypes} from '../constants.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const isPointFuture = ({dateFrom}) => dayjs().isBefore(dateFrom);
const isPointPresent = ({dateFrom, dateTo}) => dayjs().isAfter(dateFrom) && dayjs().isBefore(dateTo);
const isPointPast = ({dateTo}) => dayjs().isAfter(dateTo);

const filterBy = {
  [FilterTypes.EVERYTHING]: (points) => [...points],
  [FilterTypes.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterTypes.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterTypes.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

const generateFilters = (points) => Object.entries(filterBy).map(
  ([filterType, filterPoints]) => ({
    type: filterType,
    hasPoints: filterPoints(points).length > 0,
  }),
);

export {generateFilters};
