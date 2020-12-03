import AbstractView from './abstract';
import {Utils, FormatTime} from '../utils';
import {filmControlMap} from '../const';

const addActiveControlClass = (isActive) => {
  return isActive ? `film-card__controls-item--active` : ``;
};

const createFilmControl = ([key, value], isActive) => {
  return `
    <button class="film-card__controls-item button film-card__controls-item--${key} ${isActive}" type="button">${value}</button>
  `;
};

const createFilmCardTemplate = (film) => {
  const {
    filmInfo: {
      title,
      totalRating,
      release: {date},
      runtime,
      genres,
      poster,
      description
    },
    userInfo,
    comments
  } = film;

  const year = FormatTime.fullYear(date);
  const duration = FormatTime.duration(runtime);
  const genre = genres[0];
  const filmDescription = Utils.getShortDescription(description);
  const commentsCount = comments.length;
  const userInfoValues = Object.values(userInfo);
  const filmControls = Object.entries(filmControlMap)
    .map((item, index) => {
      return createFilmControl(item, addActiveControlClass(userInfoValues[index]));
    })
    .join(``);

  return `
    <article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${filmDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <div class="film-card__controls">
        ${filmControls}
      </div>
    </article>
  `;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._currentItem = null;

    this._clickHandler = this._clickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
    this._watchedButtonClickHandler = this._watchedButtonClickHandler.bind(this);
    this._watchlistButtonClickHandler = this._watchlistButtonClickHandler.bind(this);
  }

  _clickHandler(evt) {
    this._currentItem = evt.target;

    if (this._currentItem.className !== `film-card__poster`
      && this._currentItem.className !== `film-card__title`
      && this._currentItem.className !== `film-card__comments`) {
      return;
    }

    evt.preventDefault();

    this._handler.click(this._film);
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();

    this._handler.clickFavorite();
  }

  _watchedButtonClickHandler(evt) {
    evt.preventDefault();

    this._handler.clickWatched();
  }

  _watchlistButtonClickHandler(evt) {
    evt.preventDefault();

    this._handler.clickWatchlist(evt);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setClickHandler(handler) {
    this._handler.click = handler;

    this.getElement()
      .addEventListener(`click`, this._clickHandler);
  }

  setFavoriteButtonClickHandler(handler) {
    this._handler.clickFavorite = handler;

    this.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, this._favoriteButtonClickHandler);
  }

  setWatchedButtonClickHandler(handler) {
    this._handler.clickWatched = handler;

    this.getElement()
      .querySelector(`.film-card__controls-item--watched`)
      .addEventListener(`click`, this._watchedButtonClickHandler);
  }

  setWatchlistButtonClickHandler(handler) {
    this._handler.clickWatchlist = handler;

    this.getElement()
      .querySelector(`.film-card__controls-item--watchlist`)
      .addEventListener(`click`, this._watchlistButtonClickHandler);
  }
}
