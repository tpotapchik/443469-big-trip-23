const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)]; //todo check later
const capitalizeLetter = (someString) => someString[0].toUpperCase() + someString.slice(1);
//todo remove to lowercase
export {capitalizeLetter, getRandomArrayElement};
