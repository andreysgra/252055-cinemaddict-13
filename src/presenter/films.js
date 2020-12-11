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
import {FILMS_COUNT_PER_STEP, FILMS_EXTRA_COUNT, ExtraFilmsTitle, RenderPosition, SortType} from '../const';

export default class Films {
  constructor(container) {
    this._container = container;
    this._filmPresenter = new Map();
    this._filmTopRatedPresenter = new Map();
    this._filmMostCommentedPresenter = new Map();
    this._films = [];
    this._sourcedFilms = [];
    this._comments = [];
    this._topRatedFilms = [];
    this._mostCommentedFilms = [];
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._userProfileComponent = null;
    this._sortingListComponent = null;
    this._filmsComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._noFilmsComponent = new NoFilms();
    this._filmDetailsComponent = null;
    this._filmCommentsComponent = null;
    this._filmNewCommentComponent = null;
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._siteHeaderElement = document.querySelector(`.header`);

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  _clearFilmsList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();

    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;

    Render.remove(this._showMoreButtonComponent);
  }

  _clearFilmsMostCommentedList() {
    this._filmMostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this._filmMostCommentedPresenter.clear();
  }

  _clearFilmsTopRatedList() {
    this._filmTopRatedPresenter.forEach((presenter) => presenter.destroy());
    this._filmTopRatedPresenter.clear();
  }

  _handleFilmChange(updatedFilm) {
    this._films = Utils.updateItem(this._films, updatedFilm);
    if (this._filmPresenter.has(updatedFilm.id)) {
      this._filmPresenter.get(updatedFilm.id).init(updatedFilm, this._comments);
    }

    if (this._filmTopRatedPresenter.has(updatedFilm.id)) {
      this._filmTopRatedPresenter.get(updatedFilm.id).init(updatedFilm, this._comments);
    }

    if (this._filmMostCommentedPresenter.has(updatedFilm.id)) {
      this._filmMostCommentedPresenter.get(updatedFilm.id).init(updatedFilm, this._comments);
    }
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
    this._filmTopRatedPresenter.forEach((presenter) => presenter.resetView());
    this._filmMostCommentedPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    this._renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      Render.remove(this._showMoreButtonComponent);
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmsList();
    this._renderFilmsList();
  }

  _renderExtraFilms(filmsList, presenter, filmsListTitle) {
    if (filmsList.length > 0) {
      const filmsListExtraComponent = new FilmsListExtraView(filmsListTitle);
      const filmsListContainerComponent = new FilmsListContainerView();

      Render.render(this._filmsComponent, filmsListExtraComponent);
      Render.render(filmsListExtraComponent, filmsListContainerComponent);

      filmsList.forEach((film) => {
        this._renderFilm(filmsListContainerComponent, presenter, film);
      });
    }
  }

  _renderFilm(container, presenter, film) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);

    filmPresenter.init(film, this._comments);
    presenter.set(film.id, filmPresenter);
  }

  _renderFilmBoard() {
    if (this._films.length === 0) {
      this._renderNoFilms();

      return;
    }

    this._renderUserProfile();
    this._renderSortingList();
    this._renderFilmsListSection();
    this._renderFilmsListContainer();
    this._renderFilmsList();
    this._renderExtraFilms(this._topRatedFilms, this._filmTopRatedPresenter, ExtraFilmsTitle.TOP_RATED);
    this._renderExtraFilms(this._mostCommentedFilms, this._filmMostCommentedPresenter, ExtraFilmsTitle.MOST_COMMENTED);
  }

  _renderFilms(from, to) {
    this._films.slice(from, to)
      .forEach((film) => this._renderFilm(this._filmsListContainerComponent, this._filmPresenter, film));
  }

  _renderFilmsList() {
    this._renderFilms(0, Math.min(this._films.length, FILMS_COUNT_PER_STEP));

    if (this._films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmsListSection() {
    Render.render(this._filmsComponent, this._filmsListComponent);
  }

  _renderFilmsListContainer() {
    Render.render(this._filmsListComponent, this._filmsListContainerComponent);
  }

  _renderNoFilms() {
    Render.render(this._filmsComponent, this._noFilmsComponent);
  }

  _renderSortingList() {
    if (this._sortingListComponent !== null) {
      Render.remove(this._sortingListComponent);
      this._sortingListComponent = null;
    }

    this._sortingListComponent = new SortingListView(this._currentSortType);

    Render.render(this._filmsComponent, this._sortingListComponent, RenderPosition.BEFOREBEGIN);
    this._sortingListComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderShowMoreButton() {
    Render.render(this._filmsListComponent, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderUserProfile() {
    this._userProfileComponent = new UserProfileView(Utils.getUserRank(this._films));
    Render.render(this._siteHeaderElement, this._userProfileComponent);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort((a, b) => b.filmInfo.release.date - a.filmInfo.release.date);
        break;
      case SortType.RATING:
        this._films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
    this._renderSortingList();
  }

  init(films, comments) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._comments = comments.slice();

    this._topRatedFilms = films
      .filter((film) => film.filmInfo.totalRating > 0)
      .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
      .slice(0, FILMS_EXTRA_COUNT);

    this._mostCommentedFilms = films
      .filter((film) => film.comments.length > 0)
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, FILMS_EXTRA_COUNT);

    Render.render(this._container, this._filmsComponent);
    this._renderFilmBoard();
  }
}
