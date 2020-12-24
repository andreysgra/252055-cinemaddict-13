import FilmsFilterView from '../view/films-filter';
import {Render, Filters} from '../utils';
import {FilterType, UpdateType, RenderPosition} from '../const';

export default class Filter {
  constructor(container, filterModel, filmsModel) {
    this._container = container;

    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: `All movies`,
        count: Filters.getFilterCount(films, FilterType.ALL)
      },
      {
        type: FilterType.WATCHLIST,
        name: `Watchlist`,
        count: Filters.getFilterCount(films, FilterType.WATCHLIST)
      },
      {
        type: FilterType.HISTORY,
        name: `History`,
        count: Filters.getFilterCount(films, FilterType.HISTORY)
      },
      {
        type: FilterType.FAVORITES,
        name: `Favorites`,
        count: Filters.getFilterCount(films, FilterType.FAVORITES)
      }
    ];
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelEvent() {
    this.init();
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilmsFilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      Render.render(this._container, this._filterComponent, RenderPosition.AFTERBEGIN);

      return;
    }

    Render.replace(this._filterComponent, prevFilterComponent);
    Render.remove(prevFilterComponent);
  }
}
