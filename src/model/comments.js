import {Observer} from '../utils';

export default class Comments extends Observer {
  constructor() {
    super();

    this._comments = [];
  }

  addComment(updateType, update) {
    this._comments = [
      update,
      ...this._comments
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete nonexistent film`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType);
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = comments.slice();
  }
}
