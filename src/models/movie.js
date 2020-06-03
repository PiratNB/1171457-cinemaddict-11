import Comment from "./comment";
import {GENRES} from "../utils/consts";
import moment from "moment";

const addGenres = (genres, allGenres) => {
  genres.forEach((it) => allGenres.add(it));
};

export default class Movie {
  constructor(filmData, comments) {
    this.id = filmData[`id`];
    this.name = filmData[`film_info`][`alternative_title`];
    this.posterImage = `${filmData[`film_info`][`poster`]}`;
    this.rating = filmData[`film_info`][`total_rating`];
    this.originalName = filmData[`film_info`][`title`];
    this.director = filmData[`film_info`][`director`];
    this.writers = filmData[`film_info`][`writers`];
    this.actors = filmData[`film_info`][`actors`];
    this.releaseDate = filmData[`film_info`][`release`][`date`];
    this.runtime = filmData[`film_info`][`runtime`];
    this.country = filmData[`film_info`][`release`][`release_country`];
    this.genres = filmData[`film_info`][`genre`];
    this.description = filmData[`film_info`][`description`];
    this.ageRating = filmData[`film_info`][`age_rating`];
    this.comments = comments;
    this.isFavorite = filmData[`user_details`][`favorite`];
    this.isAtWatchlist = filmData[`user_details`][`watchlist`];
    const date = filmData[`user_details`][`watching_date`];
    this.watchingDate = date ? moment(date) : null;
    addGenres(this.genres, GENRES);
  }

  static toRaw(film) {
    return {
      'id': film.id,
      'comments': film.comments.map((it) => it.id),
      'film_info': {
        'alternative_title': film.name,
        'title': film.originalName,
        'description': film.description,
        'poster': film.posterImage,
        'genre': film.genres,
        'runtime': film.runtime,
        'release': {
          'date': film.releaseDate,
          'release_country': film.country
        },
        'total_rating': film.rating,
        'age_rating': film.ageRating,
        'director': film.director,
        'writers': film.writers,
        'actors': film.actors
      },
      'user_details': {
        'already_watched': !!film.watchingDate,
        'watching_date': film.watchingDate,
        'watchlist': film.isAtWatchlist,
        'favorite': film.isFavorite
      }
    };
  }

  static parseFilm(filmData, comments) {
    return new Movie(filmData, Comment.parseComments(comments));
  }

  static parseFilms(films, comments) {
    return films.map((film, i) => Movie.parseFilm(film, comments[i]));
  }
}
