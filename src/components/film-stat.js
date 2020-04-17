import {createElement} from "../utils";

const createStat = (films) => {
  return (
    `<p>${films.length} movie${films.length > 1 ? `s` : ``} inside</p>`
  );
};

export default class FilmStat {
  constructor(films) {
    this._films = films;

    this._element = null;
  }

  getTemplate() {
    return createStat(this._films);
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
}
