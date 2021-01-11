import {Observer} from '../utils';
import {FilterType} from '../const';

export default class FilterModel extends Observer {
  constructor() {
    super();

    this._activeFilter = FilterType.ALL;
  }

  getFilter() {
    return this._activeFilter;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;

    this._notify(updateType, filter);
  }
}
