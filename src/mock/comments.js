import Utils from '../utils';
import * as consts from "./const";

const commentId = Utils.setCounter(1000);

const generateCommentText = (sentences) => {
  const MIN_SENTENCES = 1;
  const MAX_SENTENCES = 3;

  return Utils.generateItems(sentences, MIN_SENTENCES, MAX_SENTENCES).join(` `);
};

const generateDate = (year) => {
  const MILLISECONDS_IN_DAY = 24 * 3600 * 1000;
  const DAYS_IN_YEAR = 365;
  const timestamp = MILLISECONDS_IN_DAY * DAYS_IN_YEAR * year;

  return new Date(Date.now() - Utils.getRandomInteger(0, timestamp));
};

const generateComment = () => {
  const MAX_YEAR = 3;

  return {
    id: commentId(),
    comment: generateCommentText(consts.sentences),
    emotion: Utils.getRandomItem(consts.emotions),
    author: Utils.getRandomItem(consts.filmActors),
    date: generateDate(MAX_YEAR)
  };
};

export const generateComments = () => {
  return [...Array(consts.COMMENTS_COUNT)].map(generateComment);
};