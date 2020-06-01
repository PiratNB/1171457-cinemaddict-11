import AbstractComponent from "./abstract-component";
import {FILTER_TYPE} from "../utils/consts";
import {capitalizeFirstLetter} from "../utils/utils";

export default class Navigation extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return `<nav class="main-navigation">
      <div class="main-navigation__items">
      ${this._filters.map((filter) => `
        <a href="#${filter.type}" class="main-navigation__item ${filter.checked ? `main-navigation__item--active` : ``}">${capitalizeFirstLetter(filter.type)} ${filter.type === FILTER_TYPE.ALL ? `movies` : `<span class="main-navigation__item-count">${filter.count}</span>`}</a>
      `).join(``)}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
    `;
  }

  updateFilters(filters) {
    this._filters = filters;
  }

  setFilterChangeHandler(handler) {
    this.getElement().querySelector(`.main-navigation__items`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `A` && !evt.target.classList.contains(`main-navigation__item--active`)) {
        this.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
        evt.target.classList.add(`main-navigation__item--active`);
        handler(evt.target.hash.slice(1));
      }
    });
  }
}
