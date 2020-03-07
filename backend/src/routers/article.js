const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Article = require('../models/Article');
const adminauth = require('../middleware/adminauth');
const auth = require('../middleware/auth');
const optauth = require('../middleware/optauth');

const router = express.Router();

// POST /articles/
// Create an article
router.post('/articles/', auth, async(req, res) => {
  try {
    const article = new Article(req.body);
    article.author = mongoose.Types.ObjectId(req.user.id);
    article.created_at = Date.now();
    article.public = false;
    await article.save();
    res.status(201).send({ article });
  } catch (error) {
    console.log(error);
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// GET /articles
// Get a list of basic info about all articles
router.get('/articles', async(req, res) => {
  try {
    const articles = await Article.find({});
    res.status(201).send({ articles });
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// GET /top
// Get most recent 20 published articles
router.get('/top', async(req, res) => {
  try {
    const articles = await Article.find({public: true}).sort({'created_at': -1}).limit(20);
    res.status(201).send({ articles });
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// POST /filter
// Get articles filtered by month
router.post('/filter', async(req, res) => {
  try {
    var {month, year} = req.body;
    month += 1; // changes from zero based month to 1-12
    const monthStr = (month < 10) ? "0" + month.toString() : month.toString();
    const gte = year.toString() + "-" + monthStr + "-01T00:00:00.000Z";
    var lt;
    if (month == 12) {
      lt = (year + 1).toString() + "-01-01T00:00:00.000Z";
    } else {
      const nextMonth = month + 1;
      const nextMonthStr = (nextMonth < 10) ? "0" + nextMonth.toString() : nextMonth.toString();
      lt = year.toString() + "-" + nextMonthStr + "-01T00:00:00.000Z";
    }
    const articles = await Article.find({
      created_at: {
        $gte: new Date(gte),
        $lt: new Date(lt)
      }
    });
    res.status(201).send({ articles });
  } catch (error) {
    console.log(error);
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// POST /search
// Search articles with query
router.post('/search', async(req, res) => {
  try {
    const {query} = req.body;
    const articles = await Article
    .find(
        { $text : { $search : query } }, 
        { score : { $meta: "textScore" } },
        { public: true }
    )
    .sort({ score : { $meta : 'textScore' } });
    res.status(201).send({ articles });
  } catch (error) {
    console.log(error);
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// GET /articlebyid/:id
// Get an article
router.get('/articlebyid/:id', optauth, async(req, res) => {
  try {
    const {id} = req.params;
    const article = await Article.findById(id);
    if (article.public == false) {
      if (!req.user || (req.user.id.toString() != article.author.toString() && !req.user.admin)) {
        throw new Error("Unauthorized");
      }
    }
    res.status(201).send({ article });
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// GET /articles/:name
// Get an article by name
router.get('/articles/:name', optauth, async(req, res) => {
  try {
    const {name} = req.params;
    const article = await Article.findOne({name: name});
    if (article.public == false) {
      if (!req.user || (req.user.id.toString() != article.author.toString() && !req.user.admin)) {
        res.status(500).send("Unauthorized");
      }
    }
    res.status(201).send({ article });
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})


// PUT /articles/:id
// Update an article
router.put('/articles/:id', auth, async(req, res) => {
  try {
    const {id} = req.params;
    const newArticle = req.body;
    const article = await Article.findById(id);
    if (article.author.toString() != req.user.id.toString() && !req.user.admin) {
      throw new Error("Unauthorized");
    }
    const valid = ['public', 'name', 'title', 'category', 'brief', 'image', 'text', 'requested'];
    for (var key in newArticle) {
      if (valid.includes(key)) {
        article[key] = newArticle[key];
      }
    }
    if (!req.user.admin) {
      article.public = false;
    }
    await article.save();
    res.status(201).send({ article });
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

module.exports = router;