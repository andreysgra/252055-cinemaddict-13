import {Observer} from '../utils';

export default class Films extends Observer {
  constructor() {
    super();

    this._films = [];
  }

  get filmsCount() {
    return this._films.length;
  }

  getFilms() {
    return this._films;
  }

  setFilms(films) {
    this._films = films.slice();
  }

  updateFilm(updateType, update) {
    const index = this._films
      .findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update nonexistent film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }
}
