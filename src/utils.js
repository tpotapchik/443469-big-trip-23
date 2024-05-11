import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM D';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const humanizePointDateFrom = (dateFrom) => dateFrom ? dayjs(dateFrom).format(DATE_FORMAT) : '';

export {getRandomArrayElement, humanizePointDateFrom};
