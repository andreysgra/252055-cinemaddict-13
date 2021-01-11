import SmartView from './smart';
import {Utils, FormatTime} from '../utils';
import {filmControlMap, Emotions, State} from '../const';
import he from 'he';

const addCheckedProperty = (isChecked) => {
  return isChecked ? `checked` : ``;
};

const addDisabledProperty = (isDisabled) => {
  return isDisabled ? `disabled` : ``;
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

const createCommentTemplate = (item, isDisabled, isDeleting, deletedCommentId) => {
  const {id, comment, emotion, author, date} = item;
  const commentDate = FormatTime.getFullDateWithTime(date);
  const commentDateHumanize = FormatTime.getHumanizeDate(date);

  isDeleting = isDeleting && id === deletedCommentId;
  isDisabled = isDisabled && id === deletedCommentId;
  const buttonText = isDeleting ? `Deleting...` : `Delete`;

  return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day" title="${commentDate}">${commentDateHumanize}</span>
          <button class="film-details__comment-delete" data-id="${id}" ${addDisabledProperty(isDisabled)}>
            ${buttonText}
          </button>
        </p>
      </div>
    </li>
  `;
};

const createFilmCommentsTemplate = (comments, isDisabled, isDeleting, deletedCommentId) => {
  const commentsList = comments
    .slice()
    .sort(Utils.sortCommentsByDate)
    .map((item) => createCommentTemplate(item, isDisabled, isDeleting, deletedCommentId))
    .join(``);

  return `
    <ul class="film-details__comments-list">
      ${commentsList}
    </ul>
  `;
};

const createFilmNewCommentTemplate = (emojiIcon, checkedEmojiItem, comment, isDisabled) => {
  const emojiList = Object.values(Emotions)
    .map((emotion) => createEmotion(emotion, addCheckedProperty(`emoji-${emotion}` === checkedEmojiItem)))
    .join(``);

  const emojiImg = emojiIcon !== `` ?
    `<img src="./images/emoji/${emojiIcon}.png" width="55" height="55" alt="emoji-smile">` : ``;

  return `
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${emojiImg}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${addDisabledProperty(isDisabled)}>${comment}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emojiList}
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
    emojiIcon,
    checkedEmojiItem,
    comment,
    isDisabled,
    isDeleting,
    deletedCommentId
  } = data;

  const releaseDate = FormatTime.getFullDateMonthAsString(date);
  const duration = FormatTime.getDuration(runtime);
  const writersList = writers.join(`, `);
  const actorsList = actors.join(`, `);
  const genreTitle = genres.length > 1 ? `Genres` : `Genre`;
  const genresList = createGenresTemplate(genres);
  const commentsCount = comments.length;
  const filmCommentsTemplate = createFilmCommentsTemplate(comments, isDisabled, isDeleting, deletedCommentId);
  const userInfoValues = Object.values(userInfo);
  const filmControls = Object.entries(filmControlMap)
    .map((item, index) => {
      return createFilmControl(item, addCheckedProperty(userInfoValues[index]));
    })
    .join(``);

  const filmNewComment = createFilmNewCommentTemplate(emojiIcon, checkedEmojiItem, comment, isDisabled);

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

export default class FilmDetails extends SmartView {
  constructor(film, comments) {
    super();
    this._data = this._parseFilmToData(film);
    this._comments = comments;
    this._handler = {};

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._watchedCheckboxClickHandler = this._watchedCheckboxClickHandler.bind(this);
    this._watchlistCheckboxClickHandler = this._watchlistCheckboxClickHandler.bind(this);
    this._favoriteCheckboxClickHandler = this._favoriteCheckboxClickHandler.bind(this);
    this._emojiItemsClickHandler = this._emojiItemsClickHandler.bind(this);
    this._formKeydownHandler = this._formKeydownHandler.bind(this);
    this._commentTextareaHandler = this._commentTextareaHandler.bind(this);
    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);

    this._setEmojiItemsChangeHandler(this._emojiItemsClickHandler);
    this._setCommentTextareaInputHandler(this._commentTextareaHandler);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();

    this._handler.click();
  }

  _commentTextareaHandler(evt) {
    this.updateData(
        {
          comment: evt.target.value
        },
        true
    );
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();

    this._data.deletedCommentId = evt.target.dataset.id;
    this._handler.clickDelete(this._data.id, this._data.deletedCommentId);
  }

  _emojiItemsClickHandler(evt) {
    this.updateData({
      emojiIcon: evt.target.value,
      checkedEmojiItem: evt.target.id,
      userInfo: {
        isWatchlist: this.getElement().querySelector(`#watchlist`).checked,
        isWatched: this.getElement().querySelector(`#watched`).checked,
        isFavorite: this.getElement().querySelector(`#favorite`).checked
      }
    });
  }

  _favoriteCheckboxClickHandler() {
    this._handler.clickFavorite(this._data.id);
  }

  _formKeydownHandler(evt) {
    if (evt.ctrlKey && evt.key === `Enter`) {
      if (this._data.comment === `` || this._data.emojiIcon === ``) {
        return;
      }

      const newComment = {
        comment: this._data.comment,
        emotion: this._data.emojiIcon,
        date: new Date()
      };

      this._handler.formKeydown(newComment);
    }
  }

  _parseFilmToData(film) {
    return Object.assign(
        {},
        film,
        this._resetExtraData(film)
    );
  }

  _resetExtraData(data) {
    return Object.assign(
        {},
        data,
        {
          emojiIcon: ``,
          checkedEmojiItem: ``,
          comment: ``,
          isDisabled: false,
          isDeleting: false,
          deletedCommentId: ``
        }
    );
  }

  _setCommentTextareaInputHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, handler);
  }

  _setEmojiItemsChangeHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, handler);
  }

  _watchedCheckboxClickHandler() {
    this._handler.clickWatched(this._data.id);
  }

  _watchlistCheckboxClickHandler() {
    this._handler.clickWatchlist(this._data.id);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._data, this._comments);
  }

  restoreHandlers() {
    this._setEmojiItemsChangeHandler(this._emojiItemsClickHandler);
    this._setCommentTextareaInputHandler(this._commentTextareaHandler);
    this.setCloseButtonClickHandler(this._handler.click);
    this.setFavoriteCheckboxClickHandler(this._handler.clickFavorite);
    this.setFormKeydownHandler(this._handler.formKeydown);
    this.setWatchedCheckboxClickHandler(this._handler.clickWatched);
    this.setWatchlistCheckboxClickHandler(this._handler.clickWatchlist);
    this.setDeleteButtonClickHandler(this._handler.clickDelete);
  }

  setCloseButtonClickHandler(handler) {
    this._handler.click = handler;

    this.getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._closeButtonClickHandler);
  }

  setDeleteButtonClickHandler(handler) {
    this._handler.clickDelete = handler;

    this.getElement()
      .querySelectorAll(`.film-details__comment-delete`)
      .forEach((item) => item.addEventListener(`click`, this._deleteButtonClickHandler));
  }

  setFavoriteCheckboxClickHandler(handler) {
    this._handler.clickFavorite = handler;

    this.getElement()
      .querySelector(`#favorite`)
      .addEventListener(`click`, this._favoriteCheckboxClickHandler);
  }

  setFormKeydownHandler(handler) {
    this._handler.formKeydown = handler;

    this.getElement()
      .querySelector(`form`)
      .addEventListener(`keydown`, this._formKeydownHandler);
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

  setViewState(state) {
    const resetFormState = () => {
      this.updateData({
        isDisabled: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.ADDING:
      case State.DELETING:
        this.updateData(
            {
              isDisabled: true,
              isDeleting: true
            }
        );
        break;

      case State.ABORTING:
        this.shake(resetFormState);
        break;
    }
  }

  update(film, comments) {
    this._data = this._parseFilmToData(film);
    this._comments = comments.slice();
    this.updateElement();
  }
}
