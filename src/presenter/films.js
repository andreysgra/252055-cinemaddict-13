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
import {FILMS_COUNT_PER_STEP, FILMS_EXTRA_COUNT, ExtraFilmsTitle, RenderPosition} from '../const';

export default class Films {
  constructor(container) {
    this._container = container;
    this._films = [];
    this._comments = [];
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;

    this._userProfileComponent = null;
    this._sortingListComponent = new SortingListView();
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
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    this._renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      Render.remove(this._showMoreButtonComponent);
    }
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
    this._renderExtraFilms(this._topRatedFilms, ExtraFilmsTitle.TOP_RATED);
    this._renderExtraFilms(this._mostCommentedFilms, ExtraFilmsTitle.MOST_COMMENTED);
  }

  _renderExtraFilms(filmsList, filmsListTitle) {
    if (filmsList.length > 0) {
      const filmsListExtraComponent = new FilmsListExtraView(filmsListTitle);
      const filmsListContainerComponent = new FilmsListContainerView();

      Render.render(this._filmsComponent, filmsListExtraComponent);
      Render.render(filmsListExtraComponent, filmsListContainerComponent);

      filmsList.forEach((film) => {
        this._renderFilm(filmsListContainerComponent, film);
      });
    }
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container);

    filmPresenter.init(film, this._comments);
  }

  _renderFilms(from, to) {
    this._films.slice(from, to)
      .forEach((film) => this._renderFilm(this._filmsListContainerComponent, film));
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
    Render.render(this._filmsComponent, this._sortingListComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderShowMoreButton() {
    Render.render(this._filmsListComponent, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderUserProfile() {
    this._userProfileComponent = new UserProfileView(Utils.getUserRank(this._films));
    Render.render(this._siteHeaderElement, this._userProfileComponent);
  }

  init(films, comments) {
    this._films = films.slice();
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
