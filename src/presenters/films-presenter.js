import UserProfileView from '../view/user-profile';
import SortingListView from '../view/sorting-list';
import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import FilmsListContainerView from '../view/films-list-container';
import FilmsListExtraView from '../view/films-list-extra';
import ShowMoreButtonView from '../view/show-more-button';
import NoFilms from '../view/no-films';
import {Utils, Render, Filters} from '../utils';
import {FILMS_COUNT_PER_STEP, FILMS_EXTRA_COUNT, ExtraFilmsTitle, RenderPosition, SortType, UpdateType, UserAction} from '../const';

import FilmCardView from '../view/film-card';
import FilmDetailsView from '../view/film-details';

export default class FilmsPresenter {
  constructor(container, filmsModel, commentsModel, filterModel) {
    this._container = container;

    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._userProfileComponent = null;
    this._sortingListComponent = null;
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._filmsTopRatedComponent = null;
    this._filmsMostCommentedComponent = null;
    this._filmDetailsComponent = null;
    this._showMoreButtonComponent = null;
    this._noFilmsComponent = new NoFilms();

    this._filmMainComponents = new Map();
    this._filmTopRatedComponents = new Map();
    this._filmMostCommentedComponents = new Map();

    this._siteHeaderElement = document.querySelector(`.header`);
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleAddCommentClick = this._handleAddCommentClick.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  _clearFilmsBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    this._clearFilmsMain(resetRenderedFilmCount);
    this._clearFilmsExtra();

    Render.remove(this._filmsListContainerComponent);
    Render.remove(this._filmsListComponent);
    Render.remove(this._userProfileComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _clearFilmsExtra() {
    this._filmTopRatedComponents.forEach((component) => Render.remove(component));
    this._filmTopRatedComponents.clear();

    this._filmMostCommentedComponents.forEach((component) => Render.remove(component));
    this._filmMostCommentedComponents.clear();

    Render.remove(this._filmsTopRatedComponent);
    Render.remove(this._filmsMostCommentedComponent);
  }

  _clearFilmsMain(resetRenderedFilmCount = false) {
    this._filmMainComponents.forEach((component) => Render.remove(component));
    this._filmMainComponents.clear();

    const filmsCount = this._filmsModel.filmsCount;

    Render.remove(this._sortingListComponent);
    Render.remove(this._showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }
  }

  _closeFilmDetails() {
    this._filmId = undefined;
    this._commentsModel.removeObserver(this._handleModelEvent);

    Render.remove(this._filmDetailsComponent);

    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = Filters.getFilter(films, filterType);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(Utils.sortFilmsByDate);

      case SortType.RATING:
        return filteredFilms.sort(Utils.sortFilmsByRating);

      default:
        return filteredFilms;
    }
  }

  _escKeyDownHandler(evt) {
    Utils.addEscapeEvent(evt, this._closeFilmDetails);
  }

  _handleAddCommentClick(filmId, comment) {
    const film = this._filmsModel.getFilm(filmId);
    const comments = this._commentsModel.getComments(film.id);
    let commentId = 1000;

    if (comments.length > 0) {
      commentId = Math.max(...comments.map((item) => item.id)) + 1;
    }

    comment.id = commentId;

    this._handleViewAction(
        UserAction.ADD_COMMENT,
        UpdateType.MINOR,
        Object.assign(
            {},
            film,
            {
              comments: [...comments, commentId]
            }
        )
    );

    this._commentsModel.addComment(
        UpdateType.MINOR,
        {
          id: film.id,
          comment
        }
    );
  }

  _handleDeleteCommentClick(filmId, commentId) {
    const film = this._filmsModel.getFilm(filmId);

    const currentComments = this._commentsModel.getComments(filmId).slice();

    this._handleViewAction(
        UserAction.DELETE_COMMENT,
        UpdateType.MINOR,
        Object.assign(
            {},
            film,
            {
              comments: currentComments.filter((comment) => comment.id !== commentId)
            }
        )
    );

    this._commentsModel.deleteComment(
        UpdateType.MINOR,
        {
          id: film.id,
          idDeleted: commentId
        }
    );
  }

  _handleFavoriteClick(filmId) {
    const film = this._filmsModel.getFilm(filmId);

    this._handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            film,
            {
              userInfo: {
                isWatchlist: film.userInfo.isWatchlist,
                isWatched: film.userInfo.isWatched,
                isFavorite: !film.userInfo.isFavorite
              }
            }
        )
    );
  }

  _handleFilmCardClick(filmId) {
    this._renderFilmDetails(filmId);
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR:
        Render.remove(this._userProfileComponent);
        this._clearFilmsMain();
        this._clearFilmsExtra();
        this._renderUserProfile();
        this._renderFilmsMain();
        this._renderFilmsTopRated();
        this._renderFilmsMostCommented();

        if (this._filmId === data.id) {
          this._filmDetailsComponent.update(
              this._filmsModel.getFilm(data.id),
              this._commentsModel.getComments(data.id)
          );
        }
        break;

      case UpdateType.MAJOR:
        this._clearFilmsBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmsBoard();
        break;
    }
  }

  _handleShowMoreButtonClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    films.forEach((film) => this._renderFilm(
        this._filmsListContainerComponent,
        this._filmMainComponents,
        film
    ));

    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      Render.remove(this._showMoreButtonComponent);
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsMain(true);
    this._renderFilmsMain();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;

      case UserAction.ADD_COMMENT:
        this._filmsModel.updateFilm(updateType, update);
        break;

      case UserAction.DELETE_COMMENT:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleWatchedClick(filmId) {
    const film = this._filmsModel.getFilm(filmId);

    this._handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            film,
            {
              userInfo: {
                isWatchlist: film.userInfo.isWatchlist,
                isWatched: !film.userInfo.isWatched,
                isFavorite: film.userInfo.isFavorite
              }
            }
        )
    );
  }

  _handleWatchlistClick(filmId) {
    const film = this._filmsModel.getFilm(filmId);

    this._handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            film,
            {
              userInfo: {
                isWatchlist: !film.userInfo.isWatchlist,
                isWatched: film.userInfo.isWatched,
                isFavorite: film.userInfo.isFavorite
              }
            }
        )
    );
  }

  _renderFilm(container, components, film) {
    const filmComponent = new FilmCardView(film);

    filmComponent.setClickHandler(this._handleFilmCardClick);
    filmComponent.setWatchlistButtonClickHandler(this._handleWatchlistClick);
    filmComponent.setWatchedButtonClickHandler(this._handleWatchedClick);
    filmComponent.setFavoriteButtonClickHandler(this._handleFavoriteClick);

    Render.render(container, filmComponent);
    components.set(film.id, filmComponent);
  }

  _renderFilmDetails(filmId) {
    if (this._filmDetailsComponent !== null) {
      this._closeFilmDetails();
      this._filmDetailsComponent = null;
    }

    this._filmId = filmId;
    this._commentsModel.addObserver(this._handleModelEvent);

    this._filmDetailsComponent = new FilmDetailsView(
        this._filmsModel.getFilm(this._filmId),
        this._commentsModel.getComments(this._filmId)
    );

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

  _renderFilmsBoard() {
    if (this._filmsModel.filmsCount === 0) {
      this._renderNoFilms();

      return;
    }

    Render.render(this._filmsComponent, this._filmsListComponent);
    Render.render(this._filmsListComponent, this._filmsListContainerComponent);

    this._renderUserProfile();
    this._renderFilmsMain();
    this._renderFilmsTopRated();
    this._renderFilmsMostCommented();
  }

  _renderFilmsExtra(filmsListExtraComponent, filmsList, components) {
    if (filmsList.length > 0) {
      const filmsListContainerComponent = new FilmsListContainerView();

      Render.render(this._filmsComponent, filmsListExtraComponent);
      Render.render(filmsListExtraComponent, filmsListContainerComponent);

      filmsList.forEach((film) => {
        this._renderFilm(filmsListContainerComponent, components, film);
      });
    }
  }

  _renderFilmsMain() {
    const filmsCount = this._filmsModel.filmsCount;
    const films = this._getFilms().slice(0, Math.min(filmsCount, this._renderedFilmsCount));

    films.forEach((film) => this._renderFilm(
        this._filmsListContainerComponent,
        this._filmMainComponents,
        film
    ));

    if (filmsCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }

    this._renderSortingList();
  }

  _renderFilmsMostCommented() {
    const filmsList = this._filmsModel.getFilms()
      .filter((film) => film.comments.length > 0)
      .sort(Utils.sortFilmsByComments)
      .slice(0, FILMS_EXTRA_COUNT);

    this._filmsMostCommentedComponent = new FilmsListExtraView(ExtraFilmsTitle.MOST_COMMENTED);
    this._renderFilmsExtra(this._filmsMostCommentedComponent, filmsList, this._filmMostCommentedComponents);
  }

  _renderFilmsTopRated() {
    const filmsList = this._filmsModel.getFilms()
      .filter((film) => film.filmInfo.totalRating > 0)
      .sort(Utils.sortFilmsByRating)
      .slice(0, FILMS_EXTRA_COUNT);

    this._filmsTopRatedComponent = new FilmsListExtraView(ExtraFilmsTitle.TOP_RATED);
    this._renderFilmsExtra(this._filmsTopRatedComponent, filmsList, this._filmTopRatedComponents);
  }

  _renderNoFilms() {
    Render.render(this._filmsComponent, this._noFilmsComponent);
  }

  _renderSortingList() {
    if (this._sortingListComponent !== null) {
      this._sortingListComponent = null;
    }

    this._sortingListComponent = new SortingListView(this._currentSortType);

    this._sortingListComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    Render.render(this._filmsComponent, this._sortingListComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
    Render.render(this._filmsListComponent, this._showMoreButtonComponent);
  }

  _renderUserProfile() {
    this._userProfileComponent = new UserProfileView(Utils.getUserRank(this._filmsModel.getFilms()));
    Render.render(this._siteHeaderElement, this._userProfileComponent);
  }

  init() {
    Render.render(this._container, this._filmsComponent);
    this._renderFilmsBoard();
  }
}
