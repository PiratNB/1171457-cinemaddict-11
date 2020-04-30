import {FILTER_TYPE} from "../mocks/consts";
import {getFilmsByFilter} from "../utils/utils";
import Navigation from "../components/navigation";
import {renderElement} from "../utils/render";

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FILTER_TYPE.ALL;
    this._menuComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const allTasks = this._moviesModel.getAllMovies();
    const filters = Object.values(FILTER_TYPE).map((filterType) => {
      return {
        type: filterType,
        count: getFilmsByFilter(allTasks, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });
    if (this._menuComponent) {
      const oldElement = this._menuComponent.getElement();
      this._menuComponent.updateFilters(filters);
      this._menuComponent.removeElement();
      oldElement.parentElement.replaceChild(this._menuComponent.getElement(), oldElement);
    } else {
      this._menuComponent = new Navigation(filters);
      renderElement(this._container, this._menuComponent);
    }

    this._menuComponent.setFilterChangeHandler(this._onFilterChange);
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
