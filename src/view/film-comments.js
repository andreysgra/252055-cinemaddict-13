import AbstractView from './abstract';
import {FormatTime} from '../utils';

const createCommentsTemplate = (commentIds, comments) => {
  return commentIds
    .map((commentId) => comments.find((comment) => comment.id === commentId))
    .sort((a, b) => b.date - a.date)
    .map((item) => {
      const {comment, emotion, author, date} = item;
      const commentDate = FormatTime.fullDateWithTime(date);

      return `
        <li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
          </span>
          <div>
            <p class="film-details__comment-text">${comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${commentDate}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>
      `;
    })
    .join(``);
};

const createFilmCommentsTemplate = (commentIds, comments) => {
  const commentsList = createCommentsTemplate(commentIds, comments);

  return `
    <ul class="film-details__comments-list">
      ${commentsList}
    </ul>
  `;
};

export default class FilmComments extends AbstractView {
  constructor(commentIds, comments) {
    super();
    this._commentIds = commentIds;
    this._comments = comments;
  }

  getTemplate() {
    return createFilmCommentsTemplate(this._commentIds, this._comments);
  }
}
