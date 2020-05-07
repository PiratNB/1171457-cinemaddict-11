import AbstractSmartComponent from "./abstract-smart-component";
import moment from "moment";
import {GENRES, USER_RANKS} from "../mocks/consts";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 50;

const countFilmsByGenre = (films) => {
  if (!films.length) {
    return [];
  }
  return GENRES.map((genre) => {
    return {
      genre,
      count: films.reduce((acc, film) => {
        if (film.genres[0] === genre) {
          acc++;
        }
        return acc;
      }, 0)
    };
  }).sort((a, b) => b.count - a.count)
    .filter((it) => it.count > 0);
};

export default class Statistics extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
    this._films = this._filmsModel.getMovies().filter((it) => it.isWatched);

    this._chart = null;
    this._chartData = countFilmsByGenre(this._films);
  }

  getTemplate() {
    const filmsWatchedTotal = this._films.length;
    const filmsWatchedDuration = this._films.reduce((acc, it) => {
      return acc + it.runtime;
    }, 0);
    const topGenre = this._films.length ? this._chartData[0].genre : ``;
    const userRank = this._films.length ? USER_RANKS[topGenre] : ``;

    return `
      <section class="statistic">
        <p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">${this._chartData.length ? userRank : ``}</span>
        </p>
        <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
          <p class="statistic__filters-description">Show stats:</p>
          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
          <label for="statistic-all-time" class="statistic__filters-label">All time</label>
          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
          <label for="statistic-today" class="statistic__filters-label">Today</label>
          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
          <label for="statistic-week" class="statistic__filters-label">Week</label>
          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
          <label for="statistic-month" class="statistic__filters-label">Month</label>
          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
          <label for="statistic-year" class="statistic__filters-label">Year</label>
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
    this._films = this._filmsModel.getMovies().filter((it) => it.isWatched);
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

  recoveryListeners() {}

  show() {
    super.show();

    this.rerender();
  }
}
