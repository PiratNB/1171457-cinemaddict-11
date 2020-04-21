import AbstractComponent from "./abstract-component";

const createStat = (films) => {
  return (
    `<p>${films.length} movie${films.length > 1 ? `s` : ``} inside</p>`
  );
};

export default class FilmStat extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createStat(this._films);
  }
}
