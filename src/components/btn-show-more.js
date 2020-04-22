import AbstractComponent from "./abstract-component";

const createBtnShowMore = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class BtnShowMore extends AbstractComponent {

  getTemplate() {
    return createBtnShowMore();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }
}
