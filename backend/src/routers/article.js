const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Article = require('../models/Article');
const adminauth = require('../middleware/adminauth');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /articles/
// Create an article
router.post('/articles/', auth, async(req, res) => {
  try {
    const article = new Article(req.body);
    article.author = mongoose.Schema.Types.ObjectId(req.user.id);
    article.created_at = Date.now();
    article.public = false;
    await article.save();
    res.status(201).send({ article });
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// GET /articles/:id
// Get an article
router.get('/articles/:id', async(req, res) => {
  try {
    const {id} = req.params;
    const article = await Article.findById(id);
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
    const article = new Article(req.body);
    if (article.author.toString() != req.user.id.toString()) {
      throw new Error("Unauthorized");
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