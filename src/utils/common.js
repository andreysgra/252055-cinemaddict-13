import {DESCRIPTION_LENGTH} from '../const';

export default class {
  static addLeadZero(value) {
    return value < 10 ? `0${value}` : String(value);
  }

  static generateItems(items, min, max) {
    const count = this.getRandomInteger(min, max);

    return this.shuffle(items.slice())
      .slice(0, count);
  }

  static getRandomBool() {
    return Boolean(Math.random() > 0.5);
  }

  static getRandomInteger(min = 0, max = 1) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getRandomItem(array) {
    return array[this.getRandomInteger(0, array.length - 1)];
  }

  static getShortDescription(description) {
    return description.length >= DESCRIPTION_LENGTH ? `${description.slice(0, DESCRIPTION_LENGTH - 1)} ...` : description;
  }

  static setCounter(i = 0) {
    return () => i++;
  }

  static shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let random = Math.floor(Math.random() * (i + 1));
      let temp = array[random];

      array[random] = array[i];
      array[i] = temp;
    }

    return array;
  }
}
