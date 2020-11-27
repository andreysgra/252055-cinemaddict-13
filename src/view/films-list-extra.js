import {Render} from '../utils';

const createFilmsListExtraTemplate = (title) => {
  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>
    </section>
  `;
};

export default class FilmsListExtra {
  constructor(title) {
    this._element = null;
    this._title = title;
  }

  getElement() {
    if (!this._element) {
      this._element = Render.createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._title);
  }

  removeElement() {
    this._element = null;
  }
}
