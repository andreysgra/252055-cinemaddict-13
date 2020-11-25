const filmToFilterMap = {
  all: (films) => films.length,
  watchlist: (films) => films.filter((film) => film.userInfo.isWatchlist).length,
  history: (films) => films.filter((film) => film.userInfo.isWatched).length,
  favorites: (films) => films.filter((film) => film.userInfo.isFavorite).length
};

export const generateFilters = (films) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
