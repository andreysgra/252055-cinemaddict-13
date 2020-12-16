import {Observer} from '../utils';

export default class Comments extends Observer {
  constructor() {
    super();

    this._comments = [];
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = comments.slice();
  }
}
