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
    const index = this._comments[update.id]
      .findIndex((comment) => comment.id === update.idDeleted);

    if (index === -1) {
      throw new Error(`Can't delete nonexistent film`);
    }

    this._comments[update.id] = [
      ...this._comments[update.id].slice(0, index),
      ...this._comments[update.id].slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  getComments(filmId) {
    return this._comments[filmId];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }
}
