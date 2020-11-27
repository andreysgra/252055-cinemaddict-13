import {Render} from '../utils';

const createFilmsStatisticsTemplate = (count) => {
  return `
    <p>${count} movies inside</p>
  `;
};

export default class FilmsStatistics {
  constructor(count) {
    this._element = null;
    this._count = count;
  }

  getElement() {
    if (!this._element) {
      this._element = Render.createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return createFilmsStatisticsTemplate(this._count);
  }

  removeElement() {
    this._element = null;
  }
}
