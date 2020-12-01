import UserProfileView from './view/user-profile';
import SiteMenuView from './view/site-menu';
import FilmsFilterView from './view/films-filter';
import SortingListView from './view/sorting-list';
import FilmsSectionView from './view/films-section';
import FilmsListView from './view/films-list';
import FilmsListContainerView from './view/films-list-container';
import FilmCardView from './view/film-card';
import ShowMoreButtonView from './view/show-more-button';
import FilmsListExtraView from './view/films-list-extra';
import FilmsStatisticsView from './view/films-statistics';
import FilmDetailsView from './view/film-details';
import FilmCommentsView from './view/film-comments';
import NoFilms from './view/no-films';
import {Utils, Render} from './utils';
import {FILMS_COUNT_PER_STEP, FILMS_EXTRA_COUNT, ExtraFilmsTitle, RenderPosition} from './const';
import {generateFilms} from './mock/films';
import {generateComments} from './mock/comments';
import {generateFilters} from './mock/filter';

const films = generateFilms();
const comments = generateComments();
const filters = generateFilters(films);

const topRatedFilms = films
  .filter((film) => film.filmInfo.totalRating > 0)
  .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
  .slice(0, FILMS_EXTRA_COUNT);

const mostCommentedFilms = films
  .filter((film) => film.comments.length > 0)
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, FILMS_EXTRA_COUNT);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

const siteMenu = new SiteMenuView();
const FilmsSection = new FilmsSectionView();
const FilmsList = new FilmsListView();

const renderFilm = (container, film) => {
  const FilmCard = new FilmCardView(film);

  FilmCard.setClickHandler((filmInfo) => {
    const FilmDetails = new FilmDetailsView(filmInfo);

    const closeFilmDetails = () => {
      Render.remove(FilmDetails);
      document.body.classList.remove(`hide-overflow`);
      document.removeEventListener(`keydown`, escKeyDownHandler);
    };

    const escKeyDownHandler = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        closeFilmDetails();
      }
    };

    FilmDetails.setCloseButtonClickHandler(() => {
      closeFilmDetails();
    });

    document.body.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, escKeyDownHandler);

    Render.render(document.body, FilmDetails);

    const filmDetailsCommentsTitleElement = document.querySelector(`.film-details__comments-title`);

    Render.render(filmDetailsCommentsTitleElement, new FilmCommentsView(filmInfo.comments, comments), RenderPosition.AFTEREND);
  });

  Render.render(container, FilmCard);
};

const renderExtraFilms = (filmsList, filmsListTitle) => {
  if (filmsList.length > 0) {
    const filmsListExtra = new FilmsListExtraView(filmsListTitle);
    const filmsListContainer = new FilmsListContainerView();

    Render.render(FilmsSection, filmsListExtra);
    Render.render(filmsListExtra, filmsListContainer);

    filmsList.forEach((film) => {
      renderFilm(filmsListContainer, film);
    });
  }
};

Render.render(siteMainElement, siteMenu);
Render.render(siteMenu, new FilmsFilterView(filters), RenderPosition.AFTERBEGIN);
Render.render(siteMainElement, FilmsSection);
Render.render(footerStatisticsElement, new FilmsStatisticsView(films.length));

if (films.length === 0) {
  Render.render(FilmsSection, new NoFilms());
} else {
  Render.render(siteHeaderElement, new UserProfileView(Utils.getUserRank(films)));
  Render.render(FilmsSection, new SortingListView(), RenderPosition.BEFOREBEGIN);
  Render.render(FilmsSection, FilmsList);
  Render.render(FilmsList, new FilmsListContainerView());

  const filmsListContainerElement = FilmsList.getElement().querySelector(`.films-list__container`);

  for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
    renderFilm(filmsListContainerElement, films[i]);
  }

  if (films.length > FILMS_COUNT_PER_STEP) {
    let renderedFilmsCount = FILMS_COUNT_PER_STEP;

    const ShowMoreButton = new ShowMoreButtonView();

    Render.render(FilmsList, ShowMoreButton);

    ShowMoreButton.setClickHandler(() => {
      films
        .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => renderFilm(filmsListContainerElement, film));

      renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmsCount >= films.length) {
        Render.remove(ShowMoreButton);
      }
    });
  }

  renderExtraFilms(topRatedFilms, ExtraFilmsTitle.TOP_RATED);
  renderExtraFilms(mostCommentedFilms, ExtraFilmsTitle.MOST_COMMENTED);
}
