import AbstractView from './abstract';

export default class Smart extends AbstractView {
  constructor() {
    super();

    this._data = {};
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }

  updateData(update, justDataUpdating = false) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    if (!justDataUpdating) {
      this.updateElement();
    }
  }

  updateElement() {
    const oldElement = this.getElement();
    const parentElement = oldElement.parentElement;
    const scrollTop = oldElement.scrollTop;

    this.removeElement();

    const newElement = this.getElement();

    parentElement.replaceChild(newElement, oldElement);

    newElement.scrollTop = scrollTop;
    this.restoreHandlers();
  }
}
