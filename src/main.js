import {createUserProfileTemplate} from './view/user-profile';
import {createSiteMenuTemplate} from './view/site-menu';
import {createFilmsFilterTemplate} from './view/films-filter';
import {createSortingListTemplate} from './view/sorting-list';
import {createFilmsSectionTemplate} from './view/films-section';
import {createFilmsListTemplate} from './view/films-list';
import {createFilmsListContainerTemplate} from './view/films-list-container';
import {createFilmCardTemplate} from './view/film-card';
import {createShowMoreButtonTemplate} from './view/show-more-button';
import {createFilmsListExtraTemplate} from './view/films-list-extra';
import {createFilmsStatisticsTemplate} from './view/films-statistics';
import {createFilmDetailsTemplate} from './view/film-details';
import {createFilmCommentsTemplate} from './view/film-comments';
import Render from './utils/render';
import {FILMS_COUNT_PER_STEP, FILMS_EXTRA_COUNT, extraListTitles} from './const';
import {generateFilms} from './mock/films';
import {generateComments} from './mock/comments';
import {generateFilters} from './mock/filter';

// const render = (container, template, position = `beforeend`) => {
//   container.insertAdjacentHTML(position, template);
// };

const films = generateFilms();
const comments = generateComments();
const filters = generateFilters(films);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

Render.renderTemplate(siteHeaderElement, createUserProfileTemplate());
Render.renderTemplate(siteMainElement, createSiteMenuTemplate());

const siteMenuElement = siteMainElement.querySelector(`.main-navigation`);

Render.renderTemplate(siteMenuElement, createFilmsFilterTemplate(filters), `afterbegin`);

Render.renderTemplate(siteMainElement, createSortingListTemplate());
Render.renderTemplate(siteMainElement, createFilmsSectionTemplate());

const filmsSectionElement = siteMainElement.querySelector(`.films`);

Render.renderTemplate(filmsSectionElement, createFilmsListTemplate());

const filmsListElement = filmsSectionElement.querySelector(`.films-list`);

Render.renderTemplate(filmsListElement, createFilmsListContainerTemplate());

const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  Render.renderTemplate(filmsListContainerElement, createFilmCardTemplate(films[i]));
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;

  Render.renderTemplate(filmsListElement, createShowMoreButtonTemplate());

  const showMoreButtonElement = filmsListElement.querySelector(`.films-list__show-more`);

  showMoreButtonElement.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => Render.renderTemplate(filmsListContainerElement, createFilmCardTemplate(film)));

    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButtonElement.remove();
    }
  });
}

for (const extraListTitle of extraListTitles) {
  Render.renderTemplate(filmsSectionElement, createFilmsListExtraTemplate(extraListTitle));
}

const filmsListExtraElements = filmsSectionElement.querySelectorAll(`.films-list--extra`);

filmsListExtraElements.forEach((container) => {
  Render.renderTemplate(container, createFilmsListContainerTemplate());

  const filmsListContainerExtraElement = container.querySelector(`.films-list__container`);

  for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
    Render.renderTemplate(filmsListContainerExtraElement, createFilmCardTemplate(films[i]));
  }
});

const siteFooterStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

Render.renderTemplate(siteFooterStatisticsElement, createFilmsStatisticsTemplate(films.length));
Render.renderTemplate(document.body, createFilmDetailsTemplate(films[0]));

const filmDetailsCommentsWrapElement = document.querySelector(`.film-details__comments-wrap`);

Render.renderTemplate(filmDetailsCommentsWrapElement, createFilmCommentsTemplate(films[0].comments, comments), `afterbegin`);
