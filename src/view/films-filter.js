import {default as Utils} from '../utils';
import Render from '../utils/render';

const createFilterItemTemplate = ({name, count}, isActive) => {
  const filterName = name !== `all`
    ? `${Utils.toUpperCaseFirstLetter(name)}`
    : `${Utils.toUpperCaseFirstLetter(name)} movies`;

  const filterCount = name !== `all`
    ? `<span class="main-navigation__item-count">${count}</span>`
    : ``;

  const activeFilterClassName = isActive
    ? `main-navigation__item--active`
    : ``;

  return `
    <a href="#${name}" class="main-navigation__item ${activeFilterClassName}">${filterName} ${filterCount}</a>
  `;
};

const createFilmsFilterTemplate = (filters) => {
  const filterItemsTemplate = filters
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join(``);

  return `
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
  `;
};

export default class FilmsFilter {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  getElement() {
    if (!this._element) {
      this._element = Render.createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return createFilmsFilterTemplate(this._filters);
  }

  removeElement() {
    this._element = null;
  }
}
