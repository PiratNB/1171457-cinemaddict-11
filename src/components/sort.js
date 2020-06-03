import AbstractComponent from "./abstract-component";

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};


const createSort = () => {
  return (
    `<ul class="sort">
    <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
  </ul>`
  );
};

export default class Sort extends AbstractComponent {

  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSort();
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
    this._currentSortType = SortType.DEFAULT;
    this._element.querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    this._element.querySelector(`:first-child a`).classList.add(`sort__button--active`);
  }
}
