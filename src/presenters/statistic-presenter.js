import StatisticView from '../view/statistic';
import {Render, Utils, FormatTime} from '../utils';
import {StatsType} from '../const';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export default class StatisticPresenter {
  constructor(container, filmsModel) {
    this._container = container;

    this._filmsModel = filmsModel;

    this._statisticComponent = null;
    this._currentFilter = StatsType.ALL;

    this._handleFiltersChange = this._handleFiltersChange.bind(this);
  }

  _getFilmsDataByFilter(films, currentFilter) {
    const currentDate = new Date();
    const weekAgoDate = dayjs().subtract(7, `day`).toDate();
    const monthAgoDate = dayjs().subtract(1, `month`).toDate();
    const yearAgoDate = dayjs().subtract(1, `year`).toDate();
    let filmsWatched = [];

    switch (currentFilter) {
      case StatsType.ALL:
        filmsWatched = films
          .filter((film) => film.userInfo.isWatched);
        break;

      case StatsType.TODAY:
        filmsWatched = films
          .filter((film) => film.userInfo.isWatched && dayjs(film.userInfo.watchingDate).isSame(currentDate, `day`));
        break;

      case StatsType.WEEK:
        filmsWatched = films
          .filter((film) => film.userInfo.isWatched && dayjs(film.userInfo.watchingDate).isBetween(weekAgoDate, currentDate));
        break;

      case StatsType.MONTH:
        filmsWatched = films
          .filter((film) => film.userInfo.isWatched && dayjs(film.userInfo.watchingDate).isBetween(monthAgoDate, currentDate));
        break;

      case StatsType.YEAR:
        filmsWatched = films
          .filter((film) => film.userInfo.isWatched && dayjs(film.userInfo.watchingDate).isBetween(yearAgoDate, currentDate));
        break;
    }

    const watchedFilmsCount = filmsWatched.length;
    const userRank = Utils.getUserRank(this._filmsModel.getFilms());
    const totalDuration = filmsWatched.reduce((count, film) => count + film.filmInfo.runtime, 0);
    const totalDurationHours = FormatTime.getDurationHours(totalDuration);
    const totalDurationMinutes = FormatTime.getDurationMinutes(totalDuration);

    const allFilmsGenres = filmsWatched.reduce((allGenres, film) => {
      allGenres.push(...film.filmInfo.genres);

      return allGenres;
    }, []);

    let genresList = new Map();

    allFilmsGenres.forEach((genre) => {
      if (genresList.has(genre)) {
        let genreCount = genresList.get(genre);

        genresList.set(genre, ++genreCount);
      } else {
        genresList.set(genre, 1);
      }
    });

    genresList = new Map([...genresList.entries()].sort((genreA, genreB) => genreB[1] - genreA[1]));
    const topGenre = genresList.size > 0 ? genresList.keys().next().value : ``;

    return {
      watchedFilmsCount,
      userRank,
      totalDurationHours,
      totalDurationMinutes,
      genresList,
      topGenre,
      currentFilter
    };
  }

  _handleFiltersChange(value) {
    this._currentFilter = value;

    this._statisticComponent.updateData(
        this._getFilmsDataByFilter(this._filmsModel.getFilms(), this._currentFilter)
    );
  }

  init() {
    const data = this._getFilmsDataByFilter(this._filmsModel.getFilms(), this._currentFilter);

    this._statisticComponent = new StatisticView(data);
    this._statisticComponent.setFilterItemsChangeHandler(this._handleFiltersChange);
    Render.render(this._container, this._statisticComponent);
  }
}
