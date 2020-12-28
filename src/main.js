import SiteMenuView from './view/site-menu';
import FilmsStatisticsView from './view/films-statistics';
import FilmsPresenter from './presenters/films-presenter';
import FilterPresenter from './presenters/filter-presenter';
import FilmsModel from './models/films-model';
import CommentsModel from './models/comments-model';
import FilterModel from './models/filter-model';
import Api from "./api/api";
import {Render} from './utils';
import {generateComments} from './mock/comments';
import {END_POINT, AUTHORIZATION, UpdateType, RenderPosition} from './const';

const comments = generateComments();

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

const siteMenu = new SiteMenuView();
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMenu, filterModel, filmsModel);

Render.render(footerStatisticsElement, new FilmsStatisticsView(filmsModel.filmsCount));

filmsPresenter.init();
filterPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    Render.render(siteMainElement, siteMenu, RenderPosition.AFTERBEGIN);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    Render.render(siteMainElement, siteMenu, RenderPosition.AFTERBEGIN);
  });
