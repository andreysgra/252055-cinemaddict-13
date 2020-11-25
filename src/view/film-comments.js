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

export const createFilmCommentsTemplate = (commentIds, comments) => {
  const commentsList = createCommentsTemplate(commentIds, comments);
  const commentsCount = commentIds.length;

  return `
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

    <ul class="film-details__comments-list">
      ${commentsList}
    </ul>
  `;
};
