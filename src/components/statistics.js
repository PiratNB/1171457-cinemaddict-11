
import moment from "moment";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractSmartComponent from "./abstract-smart-component";
import {GENRES, UserRanks} from "../utils/consts";
import {capitalizeFirstLetter} from "../utils/utils";

const BAR_HEIGHT = 50;
const DEFAULT_FILTER = `all-time`;
const Filters = {
  'all-time': `All`,
  'today': `Days`,
  'week': `Weeks`,
  'month': `Months`,
  'year': `Years`
};

const countFilmsByGenre = (films) => {
  if (!films.length) {
    return [];
  }
  return [...GENRES].map((genre) => {
    return {
      genre,
      count: films.reduce((acc, film) => {
        if (film.genres.includes(genre)) {
          acc++;
        }
        return acc;
      }, 0)
    };
  }).sort((a, b) => b.count - a.count)
    .filter((it) => it.count > 0);
};

const getFilteredFilms = (films, filter) => {
  if (filter === DEFAULT_FILTER) {
    return films;
  }
  return films.filter((it) => {
    return Math.abs(moment(it.watchingDate).diff(moment(), Filters[filter])) < 1;
  });
};

export default class Statistics extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
    this._films = this._filmsModel.getMovies().filter((it) => it.watchingDate);

    this._chart = null;
    this._currentFilter = DEFAULT_FILTER;
    this._chartData = countFilmsByGenre(this._films);
  }

  getTemplate() {
    const filmsWatchedTotal = this._films.length;
    const filmsWatchedDuration = this._films.reduce((acc, it) => {
      return acc + it.runtime;
    }, 0);
    const topGenre = this._chartData.length ? this._chartData[0].genre : ``;
    const userRank = topGenre ? UserRanks[topGenre] : ``;

    return `
      <section class="statistic">
        <p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">${this._chartData.length ? userRank : ``}</span>
        </p>
        <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
          <p class="statistic__filters-description">Show stats:</p>
          ${Object.keys(Filters).map((it) => `
            <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${it}" value="${it}"${it === this._currentFilter ? ` checked` : ``}>
            <label for="statistic-${it}" class="statistic__filters-label">${it === DEFAULT_FILTER ? `All time` : capitalizeFirstLetter(it)}</label>
          `).join(``)}
        </form>
        <ul class="statistic__text-list">
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">You watched</h4>
            <p class="statistic__item-text">${filmsWatchedTotal} <span class="statistic__item-description">movies</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Total duration</h4>
            <p class="statistic__item-text">${Math.floor(filmsWatchedDuration / 60)} <span class="statistic__item-description">h</span> ${moment.duration(filmsWatchedDuration, `minutes`).minutes()} <span class="statistic__item-description">m</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Top genre</h4>
            <p class="statistic__item-text">${this._chartData.length ? topGenre : ``}</p>
          </li>
        </ul>
        <div class="statistic__chart-wrap">
          <canvas class="statistic__chart" width="1000"></canvas>
        </div>
      </section>
    `;
  }

  rerender() {
    this._films = getFilteredFilms(this._filmsModel.getMovies().filter((it) => it.watchingDate), this._currentFilter);
    this._chartData = countFilmsByGenre(this._films);

    super.rerender();
    this._renderChart();
  }

  _renderChart() {
    if (!this._chartData.length) {
      return;
    }

    const chartCtx = this.getElement().querySelector(`.statistic__chart`);
    chartCtx.height = BAR_HEIGHT * this._chartData.length;

    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }

    this._chart = new Chart(chartCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._chartData.map((it) => it.genre),
        datasets: [{
          data: this._chartData.map((it) => it.count),
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`,
          barThickness: 24
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

  recoveryListeners() {
    this.getElement().querySelector(`form.statistic__filters`).addEventListener(`change`, (evt) => {
      this._currentFilter = evt.target.defaultValue;
      this.rerender();
    });
  }

  show() {
    super.show();

    this.rerender();
  }
}
