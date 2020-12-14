import AbstractView from './abstract';
import {FormatTime} from '../utils';
import {filmControlMap, Emotions} from '../const';

const addCheckedProperty = (isChecked) => {
  return isChecked ? `checked` : ``;
};

const createGenresTemplate = (genres) => {
  return genres
    .map((genre) => `<span class="film-details__genre">${genre}</span>`)
    .join(``);
};

const createFilmControl = ([key, value], checked) => {
  return `
    <input type="checkbox" class="film-details__control-input visually-hidden" id="${key}" name="${key}" ${checked}>
    <label for="${key}" class="film-details__control-label film-details__control-label--${key}">${value}</label>
  `;
};

const createEmotion = (emotion, checked) => {
  return `
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${checked}>
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>
  `;
};

const createFilmNewCommentTemplate = (emojiIcon, hasEmoji, checkedEmojiItem) => {
  const emotionsList = Object.values(Emotions)
    .map((emotion) => createEmotion(emotion, addCheckedProperty(`emoji-${emotion}` === checkedEmojiItem)))
    .join(``);

  return `
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
        ${hasEmoji ? `<img src="./images/emoji/${emojiIcon}.png" width="55" height="55" alt="emoji-smile">` : ``}
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emotionsList}
      </div>
    </div>
  `;
};

const createFilmDetailsTemplate = (film) => {
  const {
    filmInfo: {
      title,
      originalTitle,
      totalRating,
      release: {
        date,
        country
      },
      runtime,
      genres,
      poster,
      director,
      writers,
      actors,
      description,
      ageRating
    },
    userInfo,
    comments
  } = film;

  const releaseDate = FormatTime.fullDateMonthAsString(date);
  const duration = FormatTime.duration(runtime);
  const writersList = writers.join(`, `);
  const actorsList = actors.join(`, `);
  const genreTitle = genres.length > 1 ? `Genres` : `Genre`;
  const genresList = createGenresTemplate(genres);
  const commentsCount = comments.length;
  const userInfoValues = Object.values(userInfo);
  const filmControls = Object.entries(filmControlMap)
    .map((item, index) => {
      return createFilmControl(item, addCheckedProperty(userInfoValues[index]));
    })
    .join(``);

  const filmNewComment = createFilmNewCommentTemplate(``, false, ``);

  return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writersList}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actorsList}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genreTitle}</td>
                  <td class="film-details__cell">${genresList}</td>
                </tr>
              </table>

              <p class="film-details__film-description">${description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            ${filmControls}
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">
              Comments <span class="film-details__comments-count">${commentsCount}</span>
            </h3>

            ${filmNewComment}
          </section>
        </div>
      </form>
    </section>
  `;
};

export default class FilmDetails extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._watchedCheckboxClickHandler = this._watchedCheckboxClickHandler.bind(this);
    this._watchlistCheckboxClickHandler = this._watchlistCheckboxClickHandler.bind(this);
    this._favoriteCheckboxClickHandler = this._favoriteCheckboxClickHandler.bind(this);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();

    this._handler.click();
  }

  _favoriteCheckboxClickHandler() {
    this._handler.clickFavorite();
  }

  _watchedCheckboxClickHandler() {
    this._handler.clickWatched();
  }

  _watchlistCheckboxClickHandler() {
    this._handler.clickWatchlist();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  setCloseButtonClickHandler(handler) {
    this._handler.click = handler;

    this.getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._closeButtonClickHandler);
  }

  setFavoriteCheckboxClickHandler(handler) {
    this._handler.clickFavorite = handler;

    this.getElement()
      .querySelector(`#favorite`)
      .addEventListener(`click`, this._favoriteCheckboxClickHandler);
  }

  setWatchedCheckboxClickHandler(handler) {
    this._handler.clickWatched = handler;

    this.getElement()
      .querySelector(`#watched`)
      .addEventListener(`click`, this._watchedCheckboxClickHandler);
  }

  setWatchlistCheckboxClickHandler(handler) {
    this._handler.clickWatchlist = handler;

    this.getElement()
      .querySelector(`#watchlist`)
      .addEventListener(`click`, this._watchlistCheckboxClickHandler);
  }
}
