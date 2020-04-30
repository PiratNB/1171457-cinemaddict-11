import AbstractComponent from "./abstract-component";

export const SORT_TYPE = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};


const createSort = () => {
  return (
    `<ul class="sort">
    <li><a href="#" data-sort-type="${SORT_TYPE.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="${SORT_TYPE.DATE}" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="${SORT_TYPE.RATING}" class="sort__button">Sort by rating</a></li>
  </ul>`
  );
};

export default class Sort extends AbstractComponent {

  constructor() {
    super();

    this._currentSortType = SORT_TYPE.DEFAULT;
  }

  getTemplate() {
    return createSort();
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChooseHandler(handler) {
    this._element.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortTypeChosen = evt.target.dataset.sortType;
      if (this._currentSortType === sortTypeChosen) {
        return;
      }

      this._currentSortType = sortTypeChosen;
      this._element.querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
      evt.target.classList.add(`sort__button--active`);
      handler(this._currentSortType);
    });
  }

  reset() {
    this._currentSortType = SORT_TYPE.DEFAULT;
    this._element.querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    this._element.querySelector(`:first-child a`).classList.add(`sort__button--active`);
  }
}
