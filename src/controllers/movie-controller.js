import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import {removeElement, renderElement} from "../utils/render";

export default class MovieController {
  constructor(container, film, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._filmData = film;
    this._filmCard = null;
    this._filmPopup = null;
  }

  get filmData() {
    return this._filmData;
  }

  _createCard() {
    this._filmCard = new FilmCard(this._filmData);

    this._filmCard.setClickHandler(() => {
      this._filmPopup = new FilmDetails(this._filmData);
      const closePopup = () => {
        removeElement(this._filmPopup);
        document.removeEventListener(`keydown`, onEscKeydown);
      };
      const onEscKeydown = (keydownEvt) => {
        if (keydownEvt.code === `Escape`) {
          closePopup();
        }
      };

      renderElement(document.querySelector(`body`), this._filmPopup);
      this._filmPopup.setCloseClickHandler(closePopup);
      document.addEventListener(`keydown`, onEscKeydown);
    });

    this._filmCard.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, Object.assign({}, this._filmData, {isAtWatchlist: !this._filmData.isAtWatchlist}));
    });

    this._filmCard.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, Object.assign({}, this._filmData, {isWatched: !this._filmData.isWatched}));
    });

    this._filmCard.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, Object.assign({}, this._filmData, {isFavorite: !this._filmData.isFavorite}));
    });
  }

  render() {
    this._createCard();

    renderElement(this._container, this._filmCard); // Рендер карточек фильмов
  }

  rerenderCard(newData) {
    this._filmData = newData;

    const parentContainer = this._filmCard.getElement().parentElement;
    const oldCard = this._filmCard.getElement();

    this._createCard();
    parentContainer.replaceChild(this._filmCard.getElement(), oldCard);
  }

  removeCard() {
    removeElement(this._filmCard);
  }
}
