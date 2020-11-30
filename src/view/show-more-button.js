import AbstractView from './abstract';

const createShowMoreButtonTemplate = () => {
  return `
    <button class="films-list__show-more">Show more</button>
  `;
};

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler(evt) {
    evt.preventDefault();

    this._handler.click();
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  setClickHandler(handler) {
    this._handler.click = handler;

    this.getElement()
      .addEventListener(`click`, this._clickHandler);
  }
}
