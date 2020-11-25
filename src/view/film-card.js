import {default as Utils, FormatTime} from '../utils';

const addActiveControlClass = (isActive) => {
  return isActive ? `film-card__controls-item--active` : ``;
};

export const createFilmCardTemplate = (film) => {
  const {
    filmInfo: {
      title,
      totalRating,
      release: {date},
      runtime,
      genres,
      poster,
      description
    },
    userInfo: {
      isWatchlist,
      isWatched,
      isFavorite
    },
    comments
  } = film;

  const year = FormatTime.fullYear(date);
  const duration = FormatTime.duration(runtime);
  const genre = genres[0];
  const filmDescription = Utils.getShortDescription(description);
  const commentsCount = comments.length;
  const isWatchlistActive = addActiveControlClass(isWatchlist);
  const isWatchedActive = addActiveControlClass(isWatched);
  const isFavoriteActive = addActiveControlClass(isFavorite);

  return `
    <article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${filmDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchlistActive}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatchedActive}" type="button">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavoriteActive}" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
};
