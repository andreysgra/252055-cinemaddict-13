import SmartView from './smart';

const createUserProfileTemplate = (userRank) => {
  return `
    <section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
};

export default class UserProfile extends SmartView {
  constructor(userRank) {
    super();

    this._userRank = userRank;
  }

  getTemplate() {
    return createUserProfileTemplate(this._userRank);
  }

  restoreHandlers() {}

  setRank(userRank) {
    this._userRank = userRank;
    this.updateElement();
  }
}
