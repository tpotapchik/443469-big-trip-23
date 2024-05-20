import {SortingType} from '../constants.js';

const getTimeDifference = ({dateFrom, dateTo}) => (new Date(dateTo).getTime() - new Date(dateFrom).getTime());

const sortBy = {
  [SortingType.DAY]: (points) => [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)),
  [SortingType.TIME]: (points) => [...points].sort((a, b) => getTimeDifference(b) - getTimeDifference(a)),
  [SortingType.PRICE]: (points) => [...points].sort((a, b) => b.basePrice - a.basePrice),
};

export const sortPoints = (points, sortType) => sortBy[sortType](points);
