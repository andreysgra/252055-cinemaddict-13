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
import {FILMS_COUNT_PER_STEP, FILMS_EXTRA_COUNT, extraListTitles} from './const';
import {generateFilms} from './mock/films';
import {generateComments} from './mock/comments';
import {generateFilters} from './mock/filter';

const render = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const films = generateFilms();
const comments = generateComments();
const filters = generateFilters(films);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, createUserProfileTemplate());
render(siteMainElement, createSiteMenuTemplate());

const siteMenuElement = siteMainElement.querySelector(`.main-navigation`);

render(siteMenuElement, createFilmsFilterTemplate(filters), `afterbegin`);

render(siteMainElement, createSortingListTemplate());
render(siteMainElement, createFilmsSectionTemplate());

const filmsSectionElement = siteMainElement.querySelector(`.films`);

render(filmsSectionElement, createFilmsListTemplate());

const filmsListElement = filmsSectionElement.querySelector(`.films-list`);

render(filmsListElement, createFilmsListContainerTemplate());

const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  render(filmsListContainerElement, createFilmCardTemplate(films[i]));
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;

  render(filmsListElement, createShowMoreButtonTemplate());

  const showMoreButtonElement = filmsListElement.querySelector(`.films-list__show-more`);

  showMoreButtonElement.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => render(filmsListContainerElement, createFilmCardTemplate(film)));

    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButtonElement.remove();
    }
  });
}

for (const extraListTitle of extraListTitles) {
  render(filmsSectionElement, createFilmsListExtraTemplate(extraListTitle));
}

const filmsListExtraElements = filmsSectionElement.querySelectorAll(`.films-list--extra`);

filmsListExtraElements.forEach((container) => {
  render(container, createFilmsListContainerTemplate());

  const filmsListContainerExtraElement = container.querySelector(`.films-list__container`);

  for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
    render(filmsListContainerExtraElement, createFilmCardTemplate(films[i]));
  }
});

const siteFooterStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

render(siteFooterStatisticsElement, createFilmsStatisticsTemplate(films.length));
render(document.body, createFilmDetailsTemplate(films[0]));

const filmDetailsCommentsWrapElement = document.querySelector(`.film-details__comments-wrap`);

render(filmDetailsCommentsWrapElement, createFilmCommentsTemplate(films[0].comments, comments), `afterbegin`);
