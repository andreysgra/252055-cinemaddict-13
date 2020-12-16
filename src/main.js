import SiteMenuView from './view/site-menu';
import FilmsFilterView from './view/films-filter';
import FilmsStatisticsView from './view/films-statistics';
import FilmsModel from './model/films';
import CommentsModel from './model/comments';
import {Render} from './utils';
import {RenderPosition} from './const';
import {generateFilms} from './mock/films';
import {generateComments} from './mock/comments';
import {generateFilters} from './mock/filter';
import FilmsPresenter from './presenter/films';

const films = generateFilms();
const comments = generateComments();
const filters = generateFilters(films);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

const siteMenu = new SiteMenuView();
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel);

Render.render(siteMainElement, siteMenu);
Render.render(siteMenu, new FilmsFilterView(filters), RenderPosition.AFTERBEGIN);
Render.render(footerStatisticsElement, new FilmsStatisticsView(films.length));

filmsPresenter.init(films, comments);
