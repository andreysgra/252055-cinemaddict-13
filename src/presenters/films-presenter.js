import SortingListView from '../view/sorting-list';
import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import FilmsListContainerView from '../view/films-list-container';
import FilmsListExtraView from '../view/films-list-extra';
import ShowMoreButtonView from '../view/show-more-button';
import FilmCardView from '../view/film-card';
import FilmDetailsView from '../view/film-details';
import NoFilmsView from '../view/no-films';
import LoadingView from '../view/loading';
import {Utils, Render, Filter} from '../utils';
import {FILMS_COUNT_PER_STEP, FILMS_EXTRA_COUNT, ExtraFilmsTitle, RenderPosition, SortType, UpdateType, UserAction, State} from '../const';

export default class FilmsPresenter {
  constructor(container, models, components, api) {
    this._container = container;

    this._filmsModel = models.filmsModel;
    this._commentsModel = models.commentsModel;
    this._filterModel = models.filterModel;

    this._api = api;

    this._userProfileComponent = components.userProfileComponent;
    this._sortingListComponent = null;
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._filmsTopRatedComponent = null;
    this._filmsMostCommentedComponent = null;
    this._filmDetailsComponent = null;
    this._showMoreButtonComponent = null;
    this._noFilmsComponent = new NoFilmsView();
    this._loadingComponent = new LoadingView();

    this._filmMainComponents = new Map();
    this._filmTopRatedComponents = new Map();
    this._filmMostCommentedComponents = new Map();

    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCloseFilmDetails = this._handleCloseFilmDetails.bind(this);
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
    this._clearFilmsTopRated();
    this._clearFilmsMostCommented();

    Render.remove(this._filmsListContainerComponent);
    Render.remove(this._filmsListComponent);
    Render.remove(this._loadingComponent);
    Render.remove(this._showMoreButtonComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
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

  _clearFilmsMostCommented() {
    this._filmMostCommentedComponents.forEach((component) => Render.remove(component));
    this._filmMostCommentedComponents.clear();

    Render.remove(this._filmsMostCommentedComponent);
  }

  _clearFilmsTopRated() {
    this._filmTopRatedComponents.forEach((component) => Render.remove(component));
    this._filmTopRatedComponents.clear();

    Render.remove(this._filmsTopRatedComponent);
  }

  _createFilmComponent(film) {
    const filmComponent = new FilmCardView(film);

    filmComponent.setClickHandler(this._handleFilmCardClick);
    filmComponent.setWatchlistButtonClickHandler(this._handleWatchlistClick);
    filmComponent.setWatchedButtonClickHandler(this._handleWatchedClick);
    filmComponent.setFavoriteButtonClickHandler(this._handleFavoriteClick);

    return filmComponent;
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = Filter.getFilter(films, filterType);

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
    Utils.addEscapeEvent(evt, this._handleCloseFilmDetails);
  }

  _handleAddCommentClick(comment) {
    if (!Utils.isOnline()) {
      Utils.toast(`You can't add a new comment offline`);
    }

    this._handleViewAction(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        comment
    );
  }

  _handleCloseFilmDetails() {
    this._filmId = undefined;

    Render.remove(this._filmDetailsComponent);
    this._filmDetailsComponent = null;

    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleDeleteCommentClick(filmId, commentId) {
    if (!Utils.isOnline()) {
      Utils.toast(`You can't delete comment offline`);
    }

    this._handleViewAction(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        {
          id: filmId,
          commentId
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
                isFavorite: !film.userInfo.isFavorite,
                watchingDate: film.userInfo.watchingDate
              }
            }
        )
    );
  }

  _handleFilmCardClick(filmId) {
    const film = this._filmsModel.getFilm(filmId);

    this._api.getComments(filmId)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        this._renderFilmDetails(film, comments);
      })
      .catch(() => {
        this._commentsModel.setComments([]);
        this._renderFilmDetails(film, []);
      });
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._filmMainComponents.has(data.id)) {
          this._replaceFilmComponent(this._filmMainComponents, data.id);
        }

        if (this._filmTopRatedComponents.has(data.id)) {
          this._replaceFilmComponent(this._filmTopRatedComponents, data.id);
        }

        this._clearFilmsMostCommented();
        this._renderFilmsMostCommented();

        if (this._filmDetailsComponent && this._filmId === data.id) {
          this._filmDetailsComponent.update(data, this._commentsModel.getComments());
        }
        break;

      case UpdateType.MINOR:
        this._clearFilmsMain();
        this._clearFilmsTopRated();
        this._clearFilmsMostCommented();
        this._renderFilmsMain();
        this._renderFilmsTopRated();
        this._renderFilmsMostCommented();
        this._userProfileComponent.setRank(Utils.getUserRank(this._filmsModel.getFilms()));

        if (this._filmDetailsComponent && this._filmId === data.id) {
          this._filmDetailsComponent.update(data, this._commentsModel.getComments());
        }
        break;

      case UpdateType.MAJOR:
        this._clearFilmsBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmsBoard();
        break;

      case UpdateType.INIT:
        this._isLoading = false;
        Render.remove(this._loadingComponent);
        this._renderFilmsBoard();
        this._userProfileComponent.setRank(Utils.getUserRank(this._filmsModel.getFilms()));
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
        if (this._filmDetailsComponent) {
          this._filmDetailsComponent.setViewState(State.ADDING);
        }
        this._api.updateFilm(update)
          .then((response) => this._filmsModel.updateFilm(updateType, response))
          .catch(() => {
            if (this._filmDetailsComponent) {
              this._filmDetailsComponent.setViewState(State.ABORTING);
            }
          });
        break;

      case UserAction.ADD_COMMENT:
        this._filmDetailsComponent.setViewState(State.ADDING);
        this._api.addComment(update, this._filmId)
          .then((response) => {
            this._commentsModel.setComments(response.comments);
            this._filmsModel.updateFilm(updateType, response.movie);
          })
          .catch(() => {
            this._filmDetailsComponent.setViewState(State.ABORTING);
          });
        break;

      case UserAction.DELETE_COMMENT:
        this._filmDetailsComponent.setViewState(State.DELETING);
        this._api.deleteComment(update)
          .then(() => {
            this._commentsModel.deleteComment(updateType, update);
            this._filmsModel.updateFilm(
                updateType,
                Object.assign(
                    {},
                    this._filmsModel.getFilm(update.id),
                    {
                      comments: this._commentsModel.getComments().map((item) => item.id)
                    }
                )
            );
          })
          .catch(() => {
            this._filmDetailsComponent.setViewState(State.ABORTING);
          });
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
                isFavorite: film.userInfo.isFavorite,
                watchingDate: !film.userInfo.isWatched ? new Date() : null
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
                isFavorite: film.userInfo.isFavorite,
                watchingDate: film.userInfo.watchingDate
              }
            }
        )
    );
  }

  _renderFilm(container, components, film) {
    const filmComponent = this._createFilmComponent(film);

    Render.render(container, filmComponent);
    components.set(film.id, filmComponent);
  }

  _renderFilmDetails(film, comments) {
    if (this._filmDetailsComponent !== null) {
      this._handleCloseFilmDetails();
    }

    this._filmId = film.id;

    this._filmDetailsComponent = new FilmDetailsView(film, comments);

    document.body.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, this._escKeyDownHandler);

    this._filmDetailsComponent.setCloseButtonClickHandler(this._handleCloseFilmDetails);
    this._filmDetailsComponent.setWatchlistCheckboxClickHandler(this._handleWatchlistClick);
    this._filmDetailsComponent.setWatchedCheckboxClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setFavoriteCheckboxClickHandler(this._handleFavoriteClick);
    this._filmDetailsComponent.setDeleteButtonClickHandler(this._handleDeleteCommentClick);
    this._filmDetailsComponent.setFormKeydownHandler(this._handleAddCommentClick);

    Render.render(document.body, this._filmDetailsComponent);
  }

  _renderFilmsBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._filmsModel.filmsCount === 0) {
      this._renderNoFilms();

      return;
    }

    Render.render(this._filmsComponent, this._filmsListComponent);
    Render.render(this._filmsListComponent, this._filmsListContainerComponent);

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
    const filmsCount = this._getFilms().length;
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

  _renderLoading() {
    Render.render(this._filmsComponent, this._loadingComponent);
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
    Render.render(this._filmsListComponent, this._showMoreButtonComponent);
  }

  _renderSortingList() {
    if (this._sortingListComponent !== null) {
      this._sortingListComponent = null;
    }

    this._sortingListComponent = new SortingListView(this._currentSortType);

    this._sortingListComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    Render.render(this._filmsComponent, this._sortingListComponent, RenderPosition.BEFOREBEGIN);
  }

  _replaceFilmComponent(filmComponents, filmId) {
    const oldFilmComponent = filmComponents.get(filmId);
    const newFilmComponent = this._createFilmComponent(this._filmsModel.getFilm(filmId));

    Render.replace(newFilmComponent, oldFilmComponent);
    Render.remove(oldFilmComponent);

    filmComponents.delete(filmId);
    filmComponents.set(filmId, newFilmComponent);
  }

  hide() {
    this._sortingListComponent.getElement().classList.add(`visually-hidden`);
    this._filmsComponent.getElement().classList.add(`visually-hidden`);
  }

  init() {
    Render.render(this._container, this._filmsComponent);
    this._renderFilmsBoard();
  }

  show() {
    this._sortingListComponent.getElement().classList.remove(`visually-hidden`);
    this._filmsComponent.getElement().classList.remove(`visually-hidden`);
  }
}
