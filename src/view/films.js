import AbstractView from './abstract';

const createFilmsSectionTemplate = () => {
  return `
    <section class="films"></section>
  `;
};

export default class Films extends AbstractView {
  getTemplate() {
    return createFilmsSectionTemplate();
  }
}
