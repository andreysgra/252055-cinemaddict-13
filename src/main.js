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
import {createFilmsStatisticsTemplate} from './view/films-statistics';
import {createFilmDetailsTemplate} from './view/film-details';
import {createFilmCommentsTemplate} from './view/film-comments';
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

Render.renderElement(siteHeaderElement, new UserProfileView().getElement());
Render.renderElement(siteMainElement, siteMenu.getElement());
Render.renderElement(siteMenu.getElement(), new FilmsFilterView(filters).getElement(), RenderPosition.AFTERBEGIN);
Render.renderElement(siteMainElement, new SortingListView().getElement());
Render.renderElement(siteMainElement, FilmsSection.getElement());
Render.renderElement(FilmsSection.getElement(), FilmsList.getElement());
Render.renderElement(FilmsList.getElement(), new FilmsListContainerView().getElement());

const filmsListContainerElement = FilmsList.getElement().querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  Render.renderElement(filmsListContainerElement, new FilmCardView(films[i]).getElement());
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;

  const ShowMoreButton = new ShowMoreButtonView();

  Render.renderElement(FilmsList.getElement(), ShowMoreButton.getElement());

  ShowMoreButton.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => Render.renderElement(filmsListContainerElement, new FilmCardView(film).getElement()));

    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      ShowMoreButton.getElement().remove();
    }
  });
}

for (const extraListTitle of extraListTitles) {
  Render.renderElement(FilmsSection.getElement(), new FilmsListExtraView(extraListTitle).getElement());
}

const filmsListExtraElements = FilmsSection.getElement().querySelectorAll(`.films-list--extra`);

filmsListExtraElements.forEach((container) => {
  Render.renderElement(container, new FilmsListContainerView().getElement());

  const filmsListContainerExtraElement = container.querySelector(`.films-list__container`);

  for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
    Render.renderElement(filmsListContainerExtraElement, new FilmCardView(films[i]).getElement());
  }
});

Render.renderTemplate(footerStatisticsElement, createFilmsStatisticsTemplate(films.length));
Render.renderTemplate(document.body, createFilmDetailsTemplate(films[0]));

const filmDetailsCommentsWrapElement = document.querySelector(`.film-details__comments-wrap`);

Render.renderTemplate(filmDetailsCommentsWrapElement, createFilmCommentsTemplate(films[0].comments, comments), `afterbegin`);
