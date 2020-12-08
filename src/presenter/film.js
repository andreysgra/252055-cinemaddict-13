import FilmCardView from '../view/film-card';
import FilmDetailsView from '../view/film-details';
import FilmCommentsView from '../view/film-comments';
import FilmNewCommentView from '../view/film-new-comment';
import {Utils, Render} from '../utils';

export default class Film {
  constructor(container) {
    this._container = container;
    this._film = {};
    this._comments = [];

    this._filmComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
  }

  _handleFilmCardClick(film) {
    this._renderFilmDetails(film);
  }

  _renderFilmDetails(film) {
    this._filmDetailsComponent = new FilmDetailsView(film);
    this._filmCommentsComponent = new FilmCommentsView(film.comments, this._comments);
    this._filmNewCommentComponent = new FilmNewCommentView();

    const filmDetailsCommentsWrapElement = this._filmDetailsComponent.getElement()
      .querySelector(`.film-details__comments-wrap`);

    const closeFilmDetails = () => {
      Render.remove(this._filmDetailsComponent);
      this._filmDetailsComponent = null;
      this._filmCommentsComponent = null;
      this._filmNewCommentComponent = null;

      document.body.classList.remove(`hide-overflow`);
      document.removeEventListener(`keydown`, escKeyDownHandler);
    };

    const escKeyDownHandler = (evt) => Utils.addEscapeEvent(evt, closeFilmDetails);

    document.body.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, escKeyDownHandler);

    this._filmDetailsComponent.setCloseButtonClickHandler(closeFilmDetails);

    Render.render(document.body, this._filmDetailsComponent);
    Render.render(filmDetailsCommentsWrapElement, this._filmCommentsComponent);
    Render.render(filmDetailsCommentsWrapElement, this._filmNewCommentComponent);
  }

  destroy() {
    Render.remove(this._filmComponent);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    const oldFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardView(this._film);
    this._filmComponent.setClickHandler(this._handleFilmCardClick);

    if (oldFilmComponent === null) {
      Render.render(this._container, this._filmComponent);

      return;
    }

    Render.replace(this._filmComponent, oldFilmComponent);
    Render.remove(oldFilmComponent);
  }
}
