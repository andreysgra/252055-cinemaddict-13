import {default as Utils} from '../utils';

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

export const createFilmsFilterTemplate = (filters) => {
  const filterItemsTemplate = filters
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join(``);

  return `
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
  `;
};
