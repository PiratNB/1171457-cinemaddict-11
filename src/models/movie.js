import Comment from "./comment";

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
    this.isWatched = filmData[`user_details`][`watching_date`];
  }

  static parseFilm(filmData, comments) {
    return new Movie(filmData, comments);
  }

  static parseFilms(films, comments) {
    return films.map((film, i) => Movie.parseFilm(film, Comment.parseComments(comments[i])));
  }
}
