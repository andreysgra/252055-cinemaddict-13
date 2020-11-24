import {createUserProfileTemplate} from './view/user-profile';
import {createSiteMenuTemplate} from './view/site-menu';
import {createSortingListTemplate} from './view/sorting-list';
import {createFilmsSectionTemplate} from './view/films-section';
import {createFilmsListTemplate} from './view/films-list';
import {createFilmsListContainerTemplate} from './view/films-list-container';
import {createFilmCardTemplate} from './view/film-card';
import {createShowMoreButtonTemplate} from './view/show-more-button';
import {createFilmsListExtraTemplate} from './view/films-list-extra';
import {createFilmsStatisticsTemplate} from './view/films-statistics';
import {createFilmDetailsTemplate} from './view/film-details';
import {FILMS_MAX_COUNT, FILMS_EXTRA_COUNT, extraListTitles} from './const';

const render = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, createUserProfileTemplate());
render(siteMainElement, createSiteMenuTemplate());
render(siteMainElement, createSortingListTemplate());
render(siteMainElement, createFilmsSectionTemplate());

const filmsSectionElement = siteMainElement.querySelector(`.films`);

render(filmsSectionElement, createFilmsListTemplate());

const filmsListElement = filmsSectionElement.querySelector(`.films-list`);

render(filmsListElement, createFilmsListContainerTemplate());
render(filmsListElement, createShowMoreButtonTemplate());

const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILMS_MAX_COUNT; i++) {
  render(filmsListContainerElement, createFilmCardTemplate());
}

for (const extraListTitle of extraListTitles) {
  render(filmsSectionElement, createFilmsListExtraTemplate(extraListTitle));
}

const filmsListExtraElements = filmsSectionElement.querySelectorAll(`.films-list--extra`);

filmsListExtraElements.forEach((container) => {
  render(container, createFilmsListContainerTemplate());

  const filmsListContainerExtraElement = container.querySelector(`.films-list__container`);

  for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
    render(filmsListContainerExtraElement, createFilmCardTemplate());
  }
});

const siteFooterStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

render(siteFooterStatisticsElement, createFilmsStatisticsTemplate(30));
render(document.body, createFilmDetailsTemplate());
