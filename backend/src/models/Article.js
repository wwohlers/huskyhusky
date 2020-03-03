const mongoose = require('mongoose')

const articleSchema = mongoose.Schema({
  //author: author of the article, as id. None if the re was generated by the system.
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  created_at: {
    type: Date
  },

  // public: whether the article is public.
  public: {
    type: Boolean,
    default: false
  },

  // name: the name of the article in the URL (no spaces/capitals)
  name: {
    type: String,
    minlength: 10,
    maxlength: 100,
    unique: true
  },

  // title: title of the article.
  title: {
    type: String,
    minlength: 3,
    maxlength: 100
  },

  // genre: genre of the article.
  category: {
    type: String,
    minlength: 3,
    maxlength: 20
  },

  // brief: brief description of the article (displayed on the homepage).
  brief: {
    type: String,
    minlength: 10,
    maxlength: 200
  },

  // image: name of the article's image.
  image: {
    type: String,
    minlength: 3,
    maxlength: 100
  },

  // text: text of the post, with re:x corresponding to the re #x.
  text: {
    type: String,
    required: true,
    maxLength: 160
  }
})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article;