import {getRandomInteger, getRandomItem, getRandomBool, generateItems, setCounter} from "../utils/common";
import * as consts from "./const";

const generateDescription = (sentences) => {
  const MIN_SENTENCES = 1;
  const MAX_SENTENCES = 5;

  return generateItems(sentences, MIN_SENTENCES, MAX_SENTENCES).join(` `);
};

const generateWriters = (writers) => {
  const MIN_WRITES = 1;
  const MAX_WRITES = 3;

  return generateItems(writers, MIN_WRITES, MAX_WRITES);
};

const generateActors = (actors) => {
  const MIN_ACTORS = 2;
  const MAX_ACTORS = 7;

  return generateItems(actors, MIN_ACTORS, MAX_ACTORS);
};

const generateGenres = (genres) => {
  const MIN_GENRES = 1;
  const MAX_GENRES = 4;

  return generateItems(genres, MIN_GENRES, MAX_GENRES);
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
        getRandomInteger(MIN_RELEASE_YEAR, MAX_RELEASE_YEAR),
        getRandomInteger(MIN_RELEASE_MONTH, MAX_RELEASE_MONTH),
        getRandomInteger(MIN_RELEASE_DAY, MAX_RELEASE_DAY)
    );

  return new Date(releaseDate);
};

const generateTotalRating = () => {
  const MIN_RATING = 1;
  const MAX_RATING = 9;

  return (getRandomInteger(MIN_RATING, MAX_RATING) + Math.random()).toFixed(1);
};

const generateComments = () => {
  const commentId = setCounter(1000);
  const MIN_COMMENTS = 0;
  const MAX_COMMENTS = 5;

  const items = [...Array(consts.COMMENTS_COUNT)].map(commentId);

  return generateItems(items, MIN_COMMENTS, MAX_COMMENTS);
};

const filmId = setCounter();

const generateFilm = () => {
  return {
    id: filmId(),
    filmInfo: {
      title: getRandomItem(consts.filmTitles),
      originalTitle: getRandomItem(consts.filmOriginalTitles),
      poster: `images/posters/${getRandomItem(consts.filmPosters)}`,
      director: getRandomItem(consts.filmDirectors),
      description: generateDescription(consts.sentences),
      writers: generateWriters(consts.filmWriters),
      actors: generateActors(consts.filmActors),
      genres: generateGenres(consts.filmGenres),
      release: {
        date: generateReleaseDate(),
        country: getRandomItem(consts.filmCountries)
      },
      runtime: getRandomInteger(60, 180),
      totalRating: generateTotalRating(),
      ageRating: getRandomInteger(3, 21)
    },
    userInfo: {
      isWatchlist: getRandomBool(),
      hasWatched: getRandomBool(),
      isFavorite: getRandomBool()
    },
    comments: generateComments()
  };
};

export const generateFilms = () => {
  return [...Array(consts.FILMS_COUNT)].map(generateFilm);
};
