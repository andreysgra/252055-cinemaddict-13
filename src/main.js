import SiteMenuView from './view/site-menu';
import FilmsStatisticsView from './view/films-statistics';
import FilmsPresenter from './presenters/films-presenter';
import FilterPresenter from './presenters/filter-presenter';
import FilmsModel from './models/films-model';
import CommentsModel from './models/comments-model';
import FilterModel from './models/filter-model';
import {Render} from './utils';
import {generateFilms} from './mock/films';
import {generateComments} from './mock/comments';

const comments = generateComments();
const films = generateFilms(comments);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

const siteMenu = new SiteMenuView();
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMenu, filterModel, filmsModel);

Render.render(siteMainElement, siteMenu);
Render.render(footerStatisticsElement, new FilmsStatisticsView(filmsModel.filmsCount));

filmsPresenter.init();
filterPresenter.init();
