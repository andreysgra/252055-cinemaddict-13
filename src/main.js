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
import {Render} from './utils';
import {FILMS_COUNT_PER_STEP, FILMS_EXTRA_COUNT, extraListTitles, RenderPosition} from './const';
import {generateFilms} from './mock/films';
import {generateComments} from './mock/comments';
import {generateFilters} from './mock/filter';

const films = generateFilms();
const comments = generateComments();
const filters = generateFilters(films);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

const siteMenu = new SiteMenuView();
const FilmsSection = new FilmsSectionView();
const FilmsList = new FilmsListView();

const renderFilm = (container, film) => {
  const FilmCard = new FilmCardView(film);

  FilmCard.setElementsClickHandler((filmInfo) => {
    const FilmDetails = new FilmDetailsView(filmInfo);

    const closeFilmDetails = () => {
      FilmDetails.getElement().remove();
      FilmDetails.removeElement();
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

    Render.render(document.body, FilmDetails.getElement());

    const filmDetailsCommentsTitleElement = document.querySelector(`.film-details__comments-title`);

    Render.render(filmDetailsCommentsTitleElement, new FilmCommentsView(filmInfo.comments, comments).getElement(), RenderPosition.AFTEREND);
  });

  Render.render(container, FilmCard.getElement());
};

Render.render(siteMainElement, siteMenu.getElement());
Render.render(siteMenu.getElement(), new FilmsFilterView(filters).getElement(), RenderPosition.AFTERBEGIN);
Render.render(siteMainElement, new SortingListView().getElement());
Render.render(siteMainElement, FilmsSection.getElement());

if (films.length === 0) {
  Render.render(FilmsSection.getElement(), new NoFilms().getElement());
} else {
  Render.render(siteHeaderElement, new UserProfileView().getElement());
  Render.render(FilmsSection.getElement(), FilmsList.getElement());
  Render.render(FilmsList.getElement(), new FilmsListContainerView().getElement());

  const filmsListContainerElement = FilmsList.getElement().querySelector(`.films-list__container`);

  for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
    renderFilm(filmsListContainerElement, films[i]);
  }

  if (films.length > FILMS_COUNT_PER_STEP) {
    let renderedFilmsCount = FILMS_COUNT_PER_STEP;

    const ShowMoreButton = new ShowMoreButtonView();

    Render.render(FilmsList.getElement(), ShowMoreButton.getElement());

    ShowMoreButton.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      films
        .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => renderFilm(filmsListContainerElement, film));

      renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmsCount >= films.length) {
        ShowMoreButton.getElement().remove();
      }
    });
  }

  for (const extraListTitle of extraListTitles) {
    Render.render(FilmsSection.getElement(), new FilmsListExtraView(extraListTitle).getElement());
  }

  const filmsListExtraElements = FilmsSection.getElement().querySelectorAll(`.films-list--extra`);

  filmsListExtraElements.forEach((container) => {
    Render.render(container, new FilmsListContainerView().getElement());

    const filmsListContainerExtraElement = container.querySelector(`.films-list__container`);

    for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
      renderFilm(filmsListContainerExtraElement, films[i]);
    }
  });
}


Render.render(footerStatisticsElement, new FilmsStatisticsView(films.length).getElement());
