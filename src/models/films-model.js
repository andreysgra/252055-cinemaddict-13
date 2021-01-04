import {Observer} from '../utils';

export default class FilmsModel extends Observer {
  constructor() {
    super();

    this._films = [];
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        {
          id: film.id,
          filmInfo: {
            title: film.film_info.title,
            originalTitle: film.film_info.alternative_title,
            poster: film.film_info.poster,
            director: film.film_info.director,
            description: film.film_info.description,
            writers: film.film_info.writers,
            actors: film.film_info.actors,
            genres: film.film_info.genre,
            release: {
              date: new Date(film.film_info.release.date),
              country: film.film_info.release.release_country
            },
            runtime: film.film_info.runtime,
            totalRating: film.film_info.total_rating,
            ageRating: film.film_info.age_rating
          },
          userInfo: {
            isWatchlist: film.user_details.watchlist,
            isWatched: film.user_details.already_watched,
            isFavorite: film.user_details.favorite,
            watchingDate: film.user_details.watching_date !== null ?
              new Date(film.user_details.watching_date) : film.user_details.watching_date
          },
          comments: film.comments
        }
    );

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        {
          'id': film.id,
          'film_info': {
            'title': film.filmInfo.title,
            'alternative_title': film.filmInfo.originalTitle,
            'poster': film.filmInfo.poster,
            'director': film.filmInfo.director,
            'description': film.filmInfo.description,
            'writers': film.filmInfo.writers,
            'actors': film.filmInfo.actors,
            'genre': film.filmInfo.genres,
            'release': {
              'date': film.filmInfo.release.date.toISOString(),
              'release_country': film.filmInfo.release.country
            },
            'runtime': film.filmInfo.runtime,
            'total_rating': film.filmInfo.totalRating,
            'age_rating': film.filmInfo.ageRating,
          },
          'user_details': {
            'watchlist': film.userInfo.isWatchlist,
            'already_watched': film.userInfo.isWatched,
            'favorite': film.userInfo.isFavorite,
            'watching_date': film.userInfo.watchingDate instanceof Date ?
              film.userInfo.watchingDate.toISOString() : null
          },
          'comments': film.comments
        }
    );

    return adaptedFilm;
  }

  getFilm(id) {
    return this._films[id];
  }

  getFilms() {
    return this._films;
  }

  get filmsCount() {
    return this._films.length;
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  updateFilm(updateType, update) {
    const index = this._films
      .findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update nonexistent film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }
}
