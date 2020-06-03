import AbstractComponent from "./abstract-component";

const createFilms = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class FilmList extends AbstractComponent {

  getTemplate() {
    return createFilms();
  }
}
