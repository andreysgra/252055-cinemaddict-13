import {Render} from '../utils';

const createShowMoreButtonTemplate = () => {
  return `
    <button class="films-list__show-more">Show more</button>
  `;
};

export default class ShowMoreButton {
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
    return createShowMoreButtonTemplate();
  }

  removeElement() {
    this._element = null;
  }

  setButtonClickHandler(handler) {
    this.getElement()
      .addEventListener(`click`, handler);
  }
}
