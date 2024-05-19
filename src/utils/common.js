const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)]; //todo check later
const capitalizeLetter = (someString) => someString[0].toUpperCase() + someString.slice(1);
const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);
//todo remove to lowercase
export {capitalizeLetter, getRandomArrayElement, updateItem};
