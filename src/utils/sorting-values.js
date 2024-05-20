import {SortingTypes} from '../constants.js';

const getTimeDifference = ({dateFrom, dateTo}) => (new Date(dateTo).getTime() - new Date(dateFrom).getTime());

const sortBy = {
  [SortingTypes.DAY]: (points) => [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)),
  [SortingTypes.TIME]: (points) => [...points].sort((a, b) => getTimeDifference(b) - getTimeDifference(a)),
  [SortingTypes.PRICE]: (points) => [...points].sort((a, b) => b.basePrice - a.basePrice),
};

export const sortPoints = (points, sortType) => sortBy[sortType](points);
