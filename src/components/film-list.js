import AbstractComponent from "./abstract-component";

const createFilms = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class Film extends AbstractComponent {

  getTemplate() {
    return createFilms();
  }
}
