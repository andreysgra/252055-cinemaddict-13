import Render from '../utils/render';

const createSiteMenuTemplate = () => {
  return `
    <nav class="main-navigation">
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
  `;
};

export default class SiteMenu {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = Render.createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  removeElement() {
    this._element = null;
  }
}
