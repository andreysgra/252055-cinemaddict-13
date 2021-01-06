import {DESCRIPTION_LENGTH, RankScore, RankTitle} from '../const';

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

  static isOnline() {
    return window.navigator.onLine;
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

  static sortCommentsByDate(commentA, commentB) {
    return commentB.date - commentA.date;
  }

  static sortFilmsByComments(filmA, filmB) {
    return filmB.comments.length - filmA.comments.length;
  }

  static sortFilmsByDate(filmA, filmB) {
    return filmB.filmInfo.release.date - filmA.filmInfo.release.date;
  }

  static sortFilmsByRating(filmA, filmB) {
    return filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
  }

  static toast(message) {
    const SHOW_TIME = 5000;
    const toastContainer = document.createElement(`div`);
    const toastItem = document.createElement(`div`);

    toastContainer.classList.add(`toast-container`);

    document.body.append(toastContainer);

    toastItem.textContent = message;
    toastItem.classList.add(`toast-item`);

    toastContainer.append(toastItem);

    setTimeout(() => {
      toastItem.remove();
    }, SHOW_TIME);
  }

  static toUpperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
