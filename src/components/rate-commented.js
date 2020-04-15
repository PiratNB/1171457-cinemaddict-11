import {createElement} from "../utils";

const createTopRatedMostCommented = (title) => {
  return (
    `<section class="films-list${title ? `--extra` : ``}">
          <h2 class="films-list__title${title ? `` : ` visually-hidden`}">${title ? title : `All movies. Upcoming`}</h2>
          <div class="films-list__container"></div>
        </section>`
  );
};

export default class RateCommented {
  constructor(title) {
    this._title = title;

    this._element = null;
  }

  getTemplate() {
    return createTopRatedMostCommented(this._title);
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
