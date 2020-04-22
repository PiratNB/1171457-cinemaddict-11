import AbstractComponent from "./abstract-component";

export default class ProfileUser extends AbstractComponent {
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;
    this.updateUserLevel();
  }

  getTemplate() {
    return `
    <section class="header__profile profile">
      <p class="profile__rating">${this._userLevel}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
    `;
  }

  updateUserLevel() {
    if (this._filmsCount > 0 && this._filmsCount <= 10) {
      this._userLevel = `Novice`;
    } else if (this._filmsCount > 10 && this._filmsCount <= 20) {
      this._userLevel = `Fan`;
    } else if (this._filmsCount > 20) {
      this._userLevel = `Movie Buff`;
    }
  }
}

