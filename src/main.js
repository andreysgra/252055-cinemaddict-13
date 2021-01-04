import SiteMenuView from './view/site-menu';
import FilmsStatisticsView from './view/films-statistics';
import FilmsPresenter from './presenters/films-presenter';
import FilterPresenter from './presenters/filter-presenter';
import StatisticPresenter from './presenters/statistic-presenter';
import FilmsModel from './models/films-model';
import CommentsModel from './models/comments-model';
import FilterModel from './models/filter-model';
import Api from "./api/api";
import {Render} from './utils';
import {END_POINT, AUTHORIZATION, UpdateType, RenderPosition} from './const';

const siteMainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const siteMenu = new SiteMenuView();

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel, api);
const filterPresenter = new FilterPresenter(siteMenu, filterModel, filmsModel);
const statisticPresenter = new StatisticPresenter(siteMainElement, filmsModel);

filmsPresenter.init();
filterPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    Render.render(siteMainElement, siteMenu, RenderPosition.AFTERBEGIN);
    statisticPresenter.init();
    Render.render(footerStatisticsElement, new FilmsStatisticsView(filmsModel.filmsCount));
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    Render.render(siteMainElement, siteMenu, RenderPosition.AFTERBEGIN);
    Render.render(footerStatisticsElement, new FilmsStatisticsView(filmsModel.filmsCount));
  });
