const capitalizeLetter = (someString) => someString[0].toUpperCase() + someString.slice(1);
const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);
export {capitalizeLetter, updateItem};
