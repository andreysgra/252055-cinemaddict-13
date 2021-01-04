import SmartView from './smart.js';
import {StatsType} from '../const';

const createFilterItemTemplate = (filter, currentFilter) => {
  const {type, name} = filter;

  const checkedFilter = type === currentFilter
    ? `checked`
    : ``;

  return `
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${type}" value="${type}" ${checkedFilter}>
      <label for="statistic-${type}" class="statistic__filters-label">${name}</label>
  `;
};

const createStatisticTemplate = (data, filters) => {
  const {
    watchedFilmsCount,
    userRank,
    totalDurationHours,
    totalDurationMinutes,
    topGenre,
    currentFilter
  } = data;

  const filterItemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilter))
    .join(``);

  return `
    <section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${userRank}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        ${filterItemsTemplate}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDurationHours} <span class="statistic__item-description">h</span> ${totalDurationMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>
  `;
};

export default class Statistic extends SmartView {
  constructor(data) {
    super();

    this._data = data;
    this._filters = this._getFilters();

    this._filterItemsChangeHandler = this._filterItemsChangeHandler.bind(this);
  }

  _filterItemsChangeHandler(evt) {
    this._handler.changeFilter(evt.target.value);
  }

  _getFilters() {
    return [
      {
        type: StatsType.ALL,
        name: `All time`
      },
      {
        type: StatsType.TODAY,
        name: `Today`
      },
      {
        type: StatsType.WEEK,
        name: `Week`
      },
      {
        type: StatsType.MONTH,
        name: `Month`
      },
      {
        type: StatsType.YEAR,
        name: `Year`
      }
    ];
  }

  getTemplate() {
    return createStatisticTemplate(this._data, this._filters);
  }

  restoreHandlers() {
    this.setFilterItemsChangeHandler(this._handler.changeFilter);
  }

  setFilterItemsChangeHandler(handler) {
    this._handler.changeFilter = handler;

    this.getElement()
      .querySelector(`.statistic__filters`)
      .addEventListener(`change`, this._filterItemsChangeHandler);
  }
}
