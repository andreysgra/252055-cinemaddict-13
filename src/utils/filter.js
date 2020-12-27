import {FilterType} from "../const";

const filter = {
  [FilterType.ALL]: (films) => films.slice(),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userInfo.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userInfo.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userInfo.isFavorite)
};

export default class Filter {
  static getFilter(films, filterType) {
    return filter[filterType](films);
  }

  static getFilterCount(films, filterType) {
    return this.getFilter(films, filterType).length;
  }
}
