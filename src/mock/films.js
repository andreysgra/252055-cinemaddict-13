import {Utils} from '../utils';
import * as consts from "./const";

const generateDescription = (sentences) => {
  const MIN_SENTENCES = 1;
  const MAX_SENTENCES = 5;

  return Utils.generateItems(sentences, MIN_SENTENCES, MAX_SENTENCES).join(` `);
};

const generateWriters = (writers) => {
  const MIN_WRITES = 1;
  const MAX_WRITES = 3;

  return Utils.generateItems(writers, MIN_WRITES, MAX_WRITES);
};

const generateActors = (actors) => {
  const MIN_ACTORS = 2;
  const MAX_ACTORS = 7;

  return Utils.generateItems(actors, MIN_ACTORS, MAX_ACTORS);
};

const generateGenres = (genres) => {
  const MIN_GENRES = 1;
  const MAX_GENRES = 4;

  return Utils.generateItems(genres, MIN_GENRES, MAX_GENRES);
};

const generateReleaseDate = () => {
  const MIN_RELEASE_YEAR = 1929;
  const MAX_RELEASE_YEAR = 2020;
  const MIN_RELEASE_MONTH = 0;
  const MAX_RELEASE_MONTH = 11;
  const MIN_RELEASE_DAY = 1;
  const MAX_RELEASE_DAY = 31;
  const releaseDate = new Date()
    .setFullYear(
        Utils.getRandomInteger(MIN_RELEASE_YEAR, MAX_RELEASE_YEAR),
        Utils.getRandomInteger(MIN_RELEASE_MONTH, MAX_RELEASE_MONTH),
        Utils.getRandomInteger(MIN_RELEASE_DAY, MAX_RELEASE_DAY)
    );

  return new Date(releaseDate);
};

const generateTotalRating = () => {
  const MIN_RATING = 1;
  const MAX_RATING = 9;

  return (Utils.getRandomInteger(MIN_RATING, MAX_RATING) + Math.random()).toFixed(1);
};

const generateComments = () => {
  const commentId = Utils.setCounter(1000);
  const MIN_COMMENTS = 0;
  const MAX_COMMENTS = 5;

  const items = [...Array(consts.COMMENTS_COUNT)].map(commentId);

  return Utils.generateItems(items, MIN_COMMENTS, MAX_COMMENTS);
};

const filmId = Utils.setCounter();

const generateFilm = () => {
  const MIN_RUNTIME = 30;
  const MAX_RUNTIME = 180;
  const MIN_AGE = 3;
  const MAX_AGE = 21;

  return {
    id: filmId(),
    filmInfo: {
      title: Utils.getRandomItem(consts.filmTitles),
      originalTitle: Utils.getRandomItem(consts.filmOriginalTitles),
      poster: `images/posters/${Utils.getRandomItem(consts.filmPosters)}`,
      director: Utils.getRandomItem(consts.filmDirectors),
      description: generateDescription(consts.sentences),
      writers: generateWriters(consts.filmWriters),
      actors: generateActors(consts.filmActors),
      genres: generateGenres(consts.filmGenres),
      release: {
        date: generateReleaseDate(),
        country: Utils.getRandomItem(consts.filmCountries)
      },
      runtime: Utils.getRandomInteger(MIN_RUNTIME, MAX_RUNTIME),
      totalRating: generateTotalRating(),
      ageRating: Utils.getRandomInteger(MIN_AGE, MAX_AGE)
    },
    userInfo: {
      isWatchlist: Utils.getRandomBool(),
      isWatched: Utils.getRandomBool(),
      isFavorite: Utils.getRandomBool()
    },
    comments: generateComments()
  };
};

export const generateFilms = () => {
  return [...Array(consts.FILMS_COUNT)].map(generateFilm);
};
