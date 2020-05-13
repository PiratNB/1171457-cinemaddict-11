import AbstractComponent from "./abstract-component";

export default class ProfileUser extends AbstractComponent {
  constructor() {
    super();

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

  updateUserLevel(filmsCount) {
    if (filmsCount > 0 && filmsCount <= 10) {
      this._userLevel = `Novice`;
    } else if (filmsCount > 10 && filmsCount <= 20) {
      this._userLevel = `Fan`;
    } else if (filmsCount > 20) {
      this._userLevel = `Movie Buff`;
    }
    this._rerender();
  }

  _rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, oldElement);
  }
}
