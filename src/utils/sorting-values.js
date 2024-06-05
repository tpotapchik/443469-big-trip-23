import {SortingType} from '../constants.js';

const sortBy = {
  [SortingType.DAY]: (points) => [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)),
  [SortingType.TIME]: (points) => [...points].sort((a, b) => {
    const durationA = new Date(a.dateTo).getTime() - new Date(a.dateFrom).getTime();
    const durationB = new Date(b.dateTo).getTime() - new Date(b.dateFrom).getTime();
    return durationB - durationA;
  }),
  [SortingType.PRICE]: (points) => [...points].sort((a, b) => b.basePrice - a.basePrice),
};

export const sortPoints = (points, sortType) => sortBy[sortType](points);
