import {Render} from '../utils';

const createFilmsSectionTemplate = () => {
  return `
    <section class="films"></section>
  `;
};

export default class FilmsSection {
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
    return createFilmsSectionTemplate();
  }

  removeElement() {
    this._element = null;
  }
}
