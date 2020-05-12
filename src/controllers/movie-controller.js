import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import {removeElement, renderElement} from "../utils/render";
import moment from "moment";

export default class MovieController {
  constructor(container, film, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._filmData = film;
    this._filmCard = null;
    this._filmPopup = null;

    this._closePopup = this._closePopup.bind(this);
    this._handleEscKeydown = this._handleEscKeydown.bind(this);
  }

  _handleEscKeydown(keydownEvt) {
    if (keydownEvt.code === `Escape`) {
      this._closePopup();
    }
  }

  _closePopup() {
    removeElement(this._filmPopup);
    this._filmPopup = null;
    document.removeEventListener(`keydown`, this._handleEscKeydown);
  }

  _createCard() {
    this._filmCard = new FilmCard(this._filmData);

    this._filmCard.setClickHandler(() => {
      this._onViewChange();
      this._filmPopup = new FilmDetails(this._filmData, (newData) => {
        this._onDataChange(this, newData, this._filmData);
      });

      renderElement(document.querySelector(`body`), this._filmPopup);
      this._filmPopup.setCloseClickHandler(this._closePopup);
      document.addEventListener(`keydown`, this._handleEscKeydown);
    });

    this._filmCard.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, Object.assign({}, this._filmData, {isAtWatchlist: !this._filmData.isAtWatchlist}));
    });

    this._filmCard.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, Object.assign({}, this._filmData, {isWatched: this._filmData.isWatched ? null : moment()}));
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

  setDefaultView() {
    if (this._filmPopup) {
      this._closePopup();
    }
  }

  removeCard() {
    removeElement(this._filmCard);
  }
}
