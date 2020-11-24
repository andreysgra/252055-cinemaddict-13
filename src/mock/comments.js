import {getRandomItem, setCounter} from "../utils/common";
import Utils from '../utils';
import * as consts from "./const";

const commentId = setCounter(1000);

const generateCommentText = (sentences) => {
  const MIN_SENTENCES = 1;
  const MAX_SENTENCES = 3;

  return Utils.generateItems(sentences, MIN_SENTENCES, MAX_SENTENCES).join(` `);
};

const generateComment = () => {
  return {
    id: commentId(),
    comment: generateCommentText(consts.sentences),
    emotion: getRandomItem(consts.emotions),
    author: getRandomItem(consts.filmActors),
  };
};

export const generateComments = () => {
  return [...Array(consts.COMMENTS_COUNT)].map(generateComment);
};
