import {Observer} from '../utils';

export default class CommentsModel extends Observer {
  constructor() {
    super();

    this._comments = [];
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          date: new Date(comment.date)
        }
    );

    return adaptedComment;
  }

  addComment(updateType, update) {
    this._comments = update.slice();

    this._notify(updateType, update);
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          'date': comment.date.toISOString()
        }
    );

    return adaptedComment;
  }

  deleteComment(updateType, update) {
    const index = this._comments
      .findIndex((comment) => comment.id === update.commentId);

    if (index === -1) {
      throw new Error(`Can't delete nonexistent comment`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = comments.slice();
  }
}
