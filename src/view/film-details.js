import AbstractView from './abstract';
import {Utils, FormatTime} from '../utils';
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

const createCommentTemplate = (item) => {
  const {comment, emotion, author, date} = item;
  const commentDate = FormatTime.fullDateWithTime(date);

  return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
  `;
};

const createFilmCommentsTemplate = (commentIds, comments) => {
  const commentsList = commentIds
    .map((commentId) => comments.find((comment) => comment.id === commentId))
    .sort(Utils.sortCommentsByDate)
    .map((item) => createCommentTemplate(item))
    .join(``);

  return `
    <ul class="film-details__comments-list">
      ${commentsList}
    </ul>
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

const createFilmDetailsTemplate = (data, comments) => {
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
    comments: commentsIds,
    emojiIcon,
    hasEmoji,
    checkedEmojiItem
  } = data;

  const releaseDate = FormatTime.fullDateMonthAsString(date);
  const duration = FormatTime.duration(runtime);
  const writersList = writers.join(`, `);
  const actorsList = actors.join(`, `);
  const genreTitle = genres.length > 1 ? `Genres` : `Genre`;
  const genresList = createGenresTemplate(genres);
  const commentsCount = commentsIds.length;
  const filmCommentsTemplate = createFilmCommentsTemplate(commentsIds, comments);
  const userInfoValues = Object.values(userInfo);
  const filmControls = Object.entries(filmControlMap)
    .map((item, index) => {
      return createFilmControl(item, addCheckedProperty(userInfoValues[index]));
    })
    .join(``);

  const filmNewComment = createFilmNewCommentTemplate(emojiIcon, hasEmoji, checkedEmojiItem);

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
            ${filmCommentsTemplate}
            ${filmNewComment}
          </section>
        </div>
      </form>
    </section>
  `;
};

export default class FilmDetails extends AbstractView {
  constructor(film, comments) {
    super();
    this._data = this._parseFilmToData(film);
    this._comments = comments;

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._watchedCheckboxClickHandler = this._watchedCheckboxClickHandler.bind(this);
    this._watchlistCheckboxClickHandler = this._watchlistCheckboxClickHandler.bind(this);
    this._favoriteCheckboxClickHandler = this._favoriteCheckboxClickHandler.bind(this);
    this._emojiItemsClickHandler = this._emojiItemsClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._setEmojiItemsChangeHandler(this._emojiItemsClickHandler);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();

    this._handler.click();
  }

  _emojiItemsClickHandler(evt) {
    evt.preventDefault();

    const scrollTop = this.getElement().scrollTop;

    this.getElement().scrollTop = scrollTop;
  }

  _favoriteCheckboxClickHandler() {
    this._handler.clickFavorite();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    this._handler.formSubmit(this._parseDataToFilm(this._data));
  }

  _parseDataToFilm(data) {
    data = Object.assign({}, data);

    if (!data.hasEmoji) {
      data.hasEmoji = false;
    }

    if (!data.emojiIcon) {
      data.emojiIcon = ``;
    }

    if (!data.checkedEmojiItem) {
      data.checkedEmojiItem = ``;
    }

    delete data.emojiIcon;
    delete data.hasEmoji;
    delete data.checkedEmojiItem;

    return data;
  }

  _parseFilmToData(film) {
    return Object.assign(
        {},
        film,
        {
          emojiIcon: ``,
          hasEmoji: false,
          checkedEmojiItem: ``
        }
    );
  }

  _watchedCheckboxClickHandler() {
    this._handler.clickWatched();
  }

  _watchlistCheckboxClickHandler() {
    this._handler.clickWatchlist();
  }

  _setEmojiItemsChangeHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, handler);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._data, this._comments);
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

  setFormSubmitHandler(handler) {
    this._handler.formSubmit = handler;
    this.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, this._formSubmitHandler);
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
