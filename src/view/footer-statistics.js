import AbstractView from './abstract';

const createFooterStatisticsTemplate = (count) => {
  return `
    <section class="footer__statistics">
      <p>${count} movies inside</p>
    </section>
  `;
};

export default class FooterStatistics extends AbstractView {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._count);
  }
}
