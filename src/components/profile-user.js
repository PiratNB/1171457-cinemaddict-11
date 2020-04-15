import {createElement} from "../utils";

const getUserLevel = (filmsCount) => {
  if (filmsCount > 0 && filmsCount <= 10) {
    return `Novice`;
  } else if (filmsCount > 10 && filmsCount <= 20) {
    return `Fan`;
  } else if (filmsCount > 20) {
    return `Movie Buff`;
  }
  return ``;
};

const createProfileUser = (filmsCount) => {
  return `
    <section class="header__profile profile">
      <p class="profile__rating">${getUserLevel(filmsCount)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
    `;
};

export default class ProfileUser {
  constructor(filmsCount) {
    this._filmsCount = filmsCount;
    this._userLevel = ``;

    this._element = null;
    this.updateUserLevel();
  }

  getTemplate() {
    return createProfileUser(this._filmsCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
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

