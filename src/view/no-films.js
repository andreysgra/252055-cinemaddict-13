import {Render} from '../utils';

const createNoFilmsTemplate = () => {
  return `
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  `;
};

export default class NoFilms {
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
    return createNoFilmsTemplate();
  }

  removeElement() {
    this._element = null;
  }
}
