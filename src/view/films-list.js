import {Render} from '../utils';

const createFilmsListTemplate = () => {
  return `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>
  `;
};

export default class FilmsList {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = Render.createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return createFilmsListTemplate();
  }

  removeElement() {
    this._element = null;
  }
}
