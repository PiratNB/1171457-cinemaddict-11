import AbstractComponent from "./abstract-component";

const createFilmsList = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class FilmList extends AbstractComponent {

  getTemplate() {
    return createFilmsList();
  }
}
