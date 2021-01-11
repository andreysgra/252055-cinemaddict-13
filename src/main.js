import UserProfileView from './view/user-profile';
import SiteMenuView from './view/site-menu';
import FooterStatisticsView from './view/footer-statistics';
import FilmsPresenter from './presenters/films-presenter';
import FilterPresenter from './presenters/filter-presenter';
import StatisticPresenter from './presenters/statistic-presenter';
import FilmsModel from './models/films-model';
import CommentsModel from './models/comments-model';
import FilterModel from './models/filter-model';
import Api from './api/api';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {Render} from './utils';
import {END_POINT, AUTHORIZATION, UpdateType, RenderPosition, RankTitle, FilterType, STORE_NAME} from './const';

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

let menuActiveItemType = FilterType.ALL;

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const siteMenu = new SiteMenuView();
const userProfileComponent = new UserProfileView(RankTitle.NONE);
Render.render(siteHeaderElement, userProfileComponent);

const filmsPresenter = new FilmsPresenter(
    siteMainElement,
    {
      filmsModel,
      commentsModel,
      filterModel
    },
    {
      userProfileComponent
    },
    apiWithProvider
);

const filterPresenter = new FilterPresenter(siteMenu, filterModel, filmsModel);
const statisticPresenter = new StatisticPresenter(siteMainElement, filmsModel);

filmsPresenter.init();
filterPresenter.init();

const handleSiteMenuClick = (target) => {
  const menuCurrentItemType = target.dataset.filter;
  const menuActiveItem = siteMenu.getElement().querySelector(`.main-navigation__item--active`);
  const menuStatsItem = siteMenu.getElement().querySelector(`.main-navigation__additional`);

  if (menuCurrentItemType === menuActiveItemType) {
    return;
  }

  switch (menuCurrentItemType) {
    case FilterType.ALL:
    case FilterType.WATCHLIST:
    case FilterType.HISTORY:
    case FilterType.FAVORITES:
      statisticPresenter.hide();
      filmsPresenter.show();

      menuStatsItem.classList.remove(`main-navigation__item--active`);
      target.classList.add(`main-navigation__item--active`);
      break;

    case FilterType.STATISTIC:
      filmsPresenter.hide();
      statisticPresenter.show();

      menuActiveItem.classList.remove(`main-navigation__item--active`);
      menuStatsItem.classList.add(`main-navigation__item--active`);
      break;
  }

  menuActiveItemType = menuCurrentItemType;
};

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    siteMenu.setClickHandler(handleSiteMenuClick);
    Render.render(siteMainElement, siteMenu, RenderPosition.AFTERBEGIN);
    Render.render(siteFooterElement, new FooterStatisticsView(filmsModel.filmsCount));
    statisticPresenter.init();
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    Render.render(siteMainElement, siteMenu, RenderPosition.AFTERBEGIN);
    Render.render(siteFooterElement, new FooterStatisticsView(filmsModel.filmsCount));
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
