import {Render} from '../utils';

const createFilmsListContainerTemplate = () => {
  return `
    <div class="films-list__container"></div>
  `;
};

export default class FilmsListContainer {
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
    return createFilmsListContainerTemplate();
  }

  removeElement() {
    this._element = null;
  }
}
