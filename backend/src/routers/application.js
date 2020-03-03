const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Article = require('../models/Article');
const Application = require('../models/Application');
const adminauth = require('../middleware/adminauth');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /applications/
// Create a new application
router.post('/applications/', async(req, res) => {
  try {
    const app = new Application(req.body);
    app.approved = false;
    app.created_at = Date.now();
    await app.save();
    res.status(200).send({app});
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// GET /applications/
// Get all applications
router.get('/applications/', adminauth, async(req, res) => {
  try {
    const apps = await Application.find({});
    res.status(200).send({apps});
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// GET /applications/:id
// Get an applicaiton
router.get('/applications/:id', adminauth, async(req, res) => {
  try {
    const {id} = req.params;
    const app = await Application.findById(id);
    res.status(200).send({app});
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// PUT /applications/:id
// Set approval of application
router.put('/applications/:id', adminauth, async(req, res) => {
  try {
    const {id} = req.params;
    const app = await Application.findById(id);
    const {approved} = req.body;
    app.approved = approved;
    await app.save();
    res.status(200).send({app});
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

module.exports = router;