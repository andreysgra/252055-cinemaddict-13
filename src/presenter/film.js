import FilmCardView from '../view/film-card';
import FilmDetailsView from '../view/film-details';
import {Utils, Render} from '../utils';
import {Mode, UserAction, UpdateType} from '../const';

export default class Film {
  constructor(container, changeData, changeMode, commentsModel) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = commentsModel;
    this._film = {};

    this._filmComponent = null;
    this._filmDetailsComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleAddCommentClick = this._handleAddCommentClick.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  _closeFilmDetails() {
    this._commentsModel.removeObserver(this._handleModelEvent);

    Render.remove(this._filmDetailsComponent);

    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);

    this._mode = Mode.DEFAULT;
  }

  _createFilmComponent(film) {
    this._filmComponent = new FilmCardView(film);
    this._filmComponent.setClickHandler(this._handleFilmCardClick);
    this._filmComponent.setWatchlistButtonClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedButtonClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteButtonClickHandler(this._handleFavoriteClick);
  }

  _escKeyDownHandler(evt) {
    Utils.addEscapeEvent(evt, this._closeFilmDetails);
  }

  _handleAddCommentClick(comment) {
    const comments = this._commentsModel.getComments(this._film.id);
    let commentId = 1000;

    if (comments.length > 0) {
      commentId = Math.max(...comments.map((item) => item.id)) + 1;
    }

    comment.id = commentId;

    this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              comments: [...comments, commentId]
            }
        )
    );

    this._commentsModel.addComment(
        UpdateType.MINOR,
        {
          id: this._film.id,
          comment
        }
    );
  }

  _handleDeleteCommentClick(id) {
    const currentComments = this._commentsModel.getComments(this._film.id).slice();
    const remainingComments = currentComments.filter((comment) => comment.id !== parseInt(id, 10));

    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              comments: remainingComments
            }
        )
    );

    this._commentsModel.deleteComment(
        UpdateType.MINOR,
        {
          id: this._film.id,
          idDeleted: parseInt(id, 10)
        }
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              userInfo: {
                isWatchlist: this._film.userInfo.isWatchlist,
                isWatched: this._film.userInfo.isWatched,
                isFavorite: !this._film.userInfo.isFavorite
              }
            }
        )
    );
  }

  _handleFilmCardClick(film) {
    this._renderFilmDetails(film);
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._filmDetailsComponent.update(this._commentsModel.getComments(data.id));
        break;
    }
  }

  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              userInfo: {
                isWatchlist: this._film.userInfo.isWatchlist,
                isWatched: !this._film.userInfo.isWatched,
                isFavorite: this._film.userInfo.isFavorite
              }
            }
        )
    );
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              userInfo: {
                isWatchlist: !this._film.userInfo.isWatchlist,
                isWatched: this._film.userInfo.isWatched,
                isFavorite: this._film.userInfo.isFavorite
              }
            }
        )
    );
  }

  _renderFilmDetails(film) {
    this._changeMode();
    this._mode = Mode.EDITING;

    this._commentsModel.addObserver(this._handleModelEvent);

    this._filmDetailsComponent = new FilmDetailsView(film, this._commentsModel.getComments(film.id));

    document.body.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, this._escKeyDownHandler);

    this._filmDetailsComponent.setCloseButtonClickHandler(this._closeFilmDetails);
    this._filmDetailsComponent.setWatchlistCheckboxClickHandler(this._handleWatchlistClick);
    this._filmDetailsComponent.setWatchedCheckboxClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setFavoriteCheckboxClickHandler(this._handleFavoriteClick);
    this._filmDetailsComponent.setDeleteButtonClickHandler(this._handleDeleteCommentClick);
    this._filmDetailsComponent.setFormKeydownHandler(this._handleAddCommentClick);

    Render.render(document.body, this._filmDetailsComponent);
  }

  destroy() {
    Render.remove(this._filmComponent);
  }

  init(film) {
    this._film = film;

    const oldFilmComponent = this._filmComponent;

    this._createFilmComponent(this._film);

    if (oldFilmComponent === null) {
      Render.render(this._container, this._filmComponent);

      return;
    }

    Render.replace(this._filmComponent, oldFilmComponent);
    Render.remove(oldFilmComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmDetails();
    }
  }
}
