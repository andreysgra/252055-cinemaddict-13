import {DESCRIPTION_LENGTH} from '../const';

const RankScore = {
  NOVICE: {
    MIN: 1,
    MAX: 10
  },
  FAN: {
    MIN: 11,
    MAX: 20
  }
};

const RankTitle = {
  NONE: ``,
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`
};

export default class {
  static addEscapeEvent(evt, action) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      action(evt);
    }
  }

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
    return description.length >= DESCRIPTION_LENGTH ? `${description.slice(0, DESCRIPTION_LENGTH - 1)}...` : description;
  }

  static getUserRank(films) {
    const totalWatch = films.reduce((count, film) => count + Number(film.userInfo.isWatched), 0);

    if (totalWatch >= RankScore.NOVICE.MIN && totalWatch <= RankScore.NOVICE.MAX) {
      return RankTitle.NOVICE;
    } else if (totalWatch >= RankScore.FAN.MIN && totalWatch <= RankScore.FAN.MAX) {
      return RankTitle.FAN;
    } else if (totalWatch > RankScore.FAN.MAX) {
      return RankTitle.MOVIE_BUFF;
    } else {
      return RankTitle.NONE;
    }
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

  static toUpperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static updateItem(items, updatedItem) {
    const index = items.findIndex((item) => item.id === updatedItem.id);

    if (index === -1) {
      return items;
    }

    return [
      ...items.slice(0, index),
      updatedItem,
      ...items.slice(index + 1)
    ];
  }
}
