export const FILMS_COUNT_PER_STEP = 5;
export const FILMS_EXTRA_COUNT = 2;
export const DESCRIPTION_LENGTH = 140;

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v13`;
export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export const AUTHORIZATION = `Basic 5bewZsMc2zbdX`;
export const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

export const ExtraFilmsTitle = {
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  BEFOREBEGIN: `beforebegin`,
  AFTEREND: `afterend`
};

export const Emotions = {
  SMILE: `smile`,
  SLEEPING: `sleeping`,
  PUKE: `puke`,
  ANGRY: `angry`
};

export const filmControlMap = {
  'watchlist': `Add to watchlist`,
  'watched': `Already watched`,
  'favorite': `Add to favorites`,
};

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
  STATISTIC: `stats`
};

export const State = {
  ADDING: `ADDING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export const StatsType = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export const RankScore = {
  NOVICE: {
    MIN: 1,
    MAX: 10
  },
  FAN: {
    MIN: 11,
    MAX: 20
  }
};

export const RankTitle = {
  NONE: ``,
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`
};
