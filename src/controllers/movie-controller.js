import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import {removeElement, renderElement} from "../utils/render";

export default class MovieController {
  constructor(container) {
    this._container = container;

    this._filmCard = null;
    this._filmPopup = null;
  }

  render(film) {
    this._filmCard = new FilmCard(film);

    this._filmCard.setClickHandler(() => {
      this._filmPopup = new FilmDetails(film);
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

    renderElement(this._container, this._filmCard); // Рендер карточек фильмов
  }

  removeCard() {
    removeElement(this._filmCard);
  }
}
