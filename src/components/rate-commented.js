import AbstractComponent from "./abstract-component";

const createTopRatedMostCommented = (title) => {
  return (
    `<section class="films-list${title ? `--extra` : ``}">
          <h2 class="films-list__title${title ? `` : ` visually-hidden`}">${title ? title : `All movies. Upcoming`}</h2>
          <div class="films-list__container"></div>
        </section>`
  );
};

export default class RateCommented extends AbstractComponent {
  constructor(title) {
    super();

    this._title = title;
  }

  getTemplate() {
    return createTopRatedMostCommented(this._title);
  }
}
