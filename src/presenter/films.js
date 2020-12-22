import UserProfileView from '../view/user-profile';
import SortingListView from '../view/sorting-list';
import FilmsSectionView from '../view/films-section';
import FilmsListView from '../view/films-list';
import FilmsListContainerView from '../view/films-list-container';
import FilmsListExtraView from '../view/films-list-extra';
import ShowMoreButtonView from '../view/show-more-button';
import NoFilms from '../view/no-films';
import FilmPresenter from './film';
import {Utils, Render} from '../utils';
import {FILMS_COUNT_PER_STEP, FILMS_EXTRA_COUNT, ExtraFilmsTitle, RenderPosition, SortType, UpdateType, UserAction} from '../const';

export default class Films {
  constructor(container, filmsModel, commentsModel) {
    this._container = container;

    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;

    this._filmPresenter = new Map();
    this._filmTopRatedPresenter = new Map();
    this._filmMostCommentedPresenter = new Map();

    this._userProfileComponent = null;
    this._sortingListComponent = null;
    this._filmsComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._filmsTopRatedComponent = null;
    this._filmsMostCommentedComponent = null;
    this._noFilmsComponent = new NoFilms();
    this._showMoreButtonComponent = null;

    this._siteHeaderElement = document.querySelector(`.header`);
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  _clearFilmsBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    this._clearFilmsList({resetRenderedFilmCount, resetSortType});
    this._clearExtraFilmsList();

    Render.remove(this._userProfileComponent);
    Render.remove(this._filmsListContainerComponent);
    Render.remove(this._filmsListComponent);
  }

  _clearExtraFilmsList() {
    this._clearFilmsMostCommentedList();
    this._clearFilmsTopRatedList();

    Render.remove(this._filmsTopRatedComponent);
    Render.remove(this._filmsMostCommentedComponent);
  }

  _clearFilmsList({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();

    const filmsCount = this._filmsModel.filmsCount;

    Render.remove(this._sortingListComponent);
    Render.remove(this._showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _clearFilmsMostCommentedList() {
    this._filmMostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this._filmMostCommentedPresenter.clear();
  }

  _clearFilmsTopRatedList() {
    this._filmTopRatedPresenter.forEach((presenter) => presenter.destroy());
    this._filmTopRatedPresenter.clear();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(Utils.sortFilmsByDate);

      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort(Utils.sortFilmsByRating);

      default:
        return this._filmsModel.getFilms();
    }
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
    this._filmTopRatedPresenter.forEach((presenter) => presenter.resetView());
    this._filmMostCommentedPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._filmPresenter.has(data.id)) {
          this._filmPresenter.get(data.id).init(data);
        }

        if (this._filmTopRatedPresenter.has(data.id)) {
          this._filmTopRatedPresenter.get(data.id).init(data);
        }

        if (this._filmMostCommentedPresenter.has(data.id)) {
          this._filmMostCommentedPresenter.get(data.id).init(data);
        }
        break;

      case UpdateType.MINOR:
        this._clearFilmsList();
        this._clearExtraFilmsList();
        this._renderFilmsList();
        this._renderFilmsTopRated();
        this._renderFilmsMostCommented();
        break;

      case UpdateType.MAJOR:
        this._clearFilmsBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmsBoard();
        break;
    }
  }

  _handleShowMoreButtonClick() {
    const filmsCount = this._filmsModel.filmsCount;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilms(films);
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
    this._clearFilmsList({resetRenderedFilmCount: true});
    this._renderFilmsList();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;

      case UserAction.ADD_COMMENT:
        this._filmsModel.updateFilm(updateType, update);
        this._commentsModel.addComment(updateType, update);
        break;

      case UserAction.DELETE_COMMENT:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _renderExtraFilms(filmsListExtraComponent, filmsList, presenter) {
    if (filmsList.length > 0) {
      const filmsListContainerComponent = new FilmsListContainerView();

      Render.render(this._filmsComponent, filmsListExtraComponent);
      Render.render(filmsListExtraComponent, filmsListContainerComponent);

      filmsList.forEach((film) => {
        this._renderFilm(filmsListContainerComponent, presenter, film);
      });
    }
  }

  _renderFilm(container, presenter, film) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._commentsModel);

    filmPresenter.init(film);
    presenter.set(film.id, filmPresenter);
  }

  _renderFilmsBoard() {
    if (this._filmsModel.filmsCount === 0) {
      this._renderNoFilms();

      return;
    }

    this._renderUserProfile();
    this._renderFilmsListSection();
    this._renderFilmsListContainer();
    this._renderFilmsList();
    this._renderFilmsTopRated();
    this._renderFilmsMostCommented();
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(this._filmsListContainerComponent, this._filmPresenter, film));
  }

  _renderFilmsList() {
    const filmsCount = this._filmsModel.filmsCount;
    const films = this._getFilms().slice(0, Math.min(filmsCount, this._renderedFilmsCount));

    this._renderFilms(films);

    if (filmsCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }

    this._renderSortingList();
  }

  _renderFilmsListSection() {
    Render.render(this._filmsComponent, this._filmsListComponent);
  }

  _renderFilmsListContainer() {
    Render.render(this._filmsListComponent, this._filmsListContainerComponent);
  }

  _renderFilmsMostCommented() {
    const filmsList = this._filmsModel.getFilms()
      .filter((film) => film.comments.length > 0)
      .sort(Utils.sortFilmsByComments)
      .slice(0, FILMS_EXTRA_COUNT);

    this._filmsMostCommentedComponent = new FilmsListExtraView(ExtraFilmsTitle.MOST_COMMENTED);
    this._renderExtraFilms(this._filmsMostCommentedComponent, filmsList, this._filmMostCommentedPresenter);
  }

  _renderFilmsTopRated() {
    const filmsList = this._filmsModel.getFilms()
      .filter((film) => film.filmInfo.totalRating > 0)
      .sort(Utils.sortFilmsByRating)
      .slice(0, FILMS_EXTRA_COUNT);

    this._filmsTopRatedComponent = new FilmsListExtraView(ExtraFilmsTitle.TOP_RATED);
    this._renderExtraFilms(this._filmsTopRatedComponent, filmsList, this._filmTopRatedPresenter);
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
