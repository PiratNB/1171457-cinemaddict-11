export default class Comment {
  constructor(commentData) {
    this.id = commentData[`id`];
    this.message = commentData[`comment`];
    this.emotion = commentData[`emotion`];
    this.author = commentData[`author`];
    this.postDate = commentData[`date`];
  }

  static parseComment(commentData) {
    return new Comment(commentData);
  }

  static parseComments(comments) {
    return comments.map((comment) => Comment.parseComment(comment));
  }

  static toRaw(comment) {
    if (comment.id) {
      return {
        'id': comment.id,
        'author': comment.author,
        'comment': comment.message,
        'date': comment.postDate,
        'emotion': comment.emotion
      };
    } else {
      return {
        'comment': comment.message,
        'date': comment.postDate,
        'emotion': comment.emotion
      };
    }
  }
}

