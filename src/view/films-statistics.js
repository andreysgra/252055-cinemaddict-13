import AbstractView from './abstract';

const createFilmsStatisticsTemplate = (count) => {
  return `
    <p>${count} movies inside</p>
  `;
};

export default class FilmsStatistics extends AbstractView {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createFilmsStatisticsTemplate(this._count);
  }
}
