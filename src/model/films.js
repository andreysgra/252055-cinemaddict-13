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
}
