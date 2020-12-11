import AbstractView from './abstract';
import {SortType} from '../const';

const addActiveControlClass = (isActive) => {
  return isActive ? `sort__button--active` : ``;
};

const createSortingListItemTemplate = (sortType, isActive) => {
  return `
    <li><a href="#" class="sort__button ${isActive}" data-sort-type="${sortType}">Sort by ${sortType}</a></li>
  `;
};

const createSortingListTemplate = (currentSortType) => {
  const filmControls = Object.values(SortType)
    .map((sortType) => {
      return createSortingListItemTemplate(sortType, addActiveControlClass(sortType === currentSortType));
    })
    .join(``);

  return `
    <ul class="sort">
      ${filmControls}
    </ul>
  `;
};

export default class SortingList extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentItem = null;
    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  _sortTypeChangeHandler(evt) {
    this._currentItem = evt.target;

    if (this._currentItem.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._handler.sortTypeChange(this._currentItem.dataset.sortType);
  }

  getTemplate() {
    return createSortingListTemplate(this._currentSortType);
  }

  setSortTypeChangeHandler(handler) {
    this._handler.sortTypeChange = handler;

    this.getElement()
      .addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
