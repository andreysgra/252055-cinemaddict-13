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
    // this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  _closeFilmDetails() {
    Render.remove(this._filmDetailsComponent);
    this._filmDetailsComponent = null;

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

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
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

  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
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
        UpdateType.PATCH,
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

  // _handleFormSubmit(film) {
  //   this._changeData(film);
  // }

  _renderFilmDetails(film) {
    this._filmDetailsComponent = new FilmDetailsView(film, this._commentsModel.getComments());

    document.body.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, this._escKeyDownHandler);

    this._changeMode();
    this._mode = Mode.EDITING;

    this._filmDetailsComponent.setCloseButtonClickHandler(this._closeFilmDetails);
    this._filmDetailsComponent.setWatchlistCheckboxClickHandler(this._handleWatchlistClick);
    this._filmDetailsComponent.setWatchedCheckboxClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setFavoriteCheckboxClickHandler(this._handleFavoriteClick);
    // this._filmDetailsComponent.setFormSubmitHandler(this._handleFormSubmit);

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
