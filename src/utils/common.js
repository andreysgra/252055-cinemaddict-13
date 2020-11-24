import {DESCRIPTION_LENGTH} from '../const';

export const getRandomInteger = (min = 0, max = 1) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomItem = (array) => array[getRandomInteger(0, array.length - 1)];

export const getRandomBool = () => Boolean(Math.random() > 0.5);

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let random = Math.floor(Math.random() * (i + 1));
    let temp = array[random];

    array[random] = array[i];
    array[i] = temp;
  }

  return array;
};

export const generateItems = (items, min, max) => {
  const count = getRandomInteger(min, max);

  return shuffle(items.slice())
    .slice(0, count);
};

export const setCounter = (i = 0) => () => i++;

export const addLeadZero = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const getShortDescription = (description) => {
  return description.length >= DESCRIPTION_LENGTH ? `${description.slice(0, DESCRIPTION_LENGTH - 1)} ...` : description;
};
