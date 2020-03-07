const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Article = require('../models/Article');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const adminauth = require('../middleware/adminauth');
const validator = require('validator')

const router = express.Router();

// POST users
// Registers a user
// Takes user object
// Gives the logged in user info and their generated token
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    user.admin = false;
    user.created_at = Date.now();
    user.tokens = [];
    await user.save();

    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// GET users
// Gets a list of all users
router.get('/users', async(req, res) => {
  try {
    const users = await User.find({}, 'id name bio created_at admin');
    if (!users) {
      res.status(500).send("No users found");
      return;
    }
    res.send({users});
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// POST users/login
// Logs in a registered user
router.post('/users/login', async(req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      res.status(200).send("Authentication failed");
    } else {
      const token = await user.generateAuthToken();
      res.status(200).send({ user, token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// GET users/me
// Gets the user object of the current user
router.get('/users/me', auth, async(req, res) => {
  // View logged in user profile
  const user = req.user;
  res.status(200).send({ user });
})

// POST users/me/logout
// Logs out user from current device (deletes access token in request)
router.post('/users/me/logout', auth, async (req, res) => {
  // Log user out of the application
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token != req.token;
    })
    await req.user.save();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// POST users/me/logoutall
// Logs out user from all devices (deletes all access tokens)
router.post('/users/me/logoutall', auth, async(req, res) => {
	// Log user out of all devices
	try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.status(200).send();
	} catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
	}
})

// GET users/:id
// Gets info about the given user.
router.get('/users/:id', async(req, res) => {
	try {
		const id = req.params.id;
    const user = await User.findById(id)
    const { name, bio, created_at, admin } = user;
    if (!user) {
      res.status(400).send("Fatal: user not found");
      return;
    }
    res.status(200).send({ name, bio, created_at, admin });
	} catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
	}
});

// PUT /users/admin
// Change user admin status (admin route only)
router.put('/users/admin', adminauth, async(req,res) => {
  try {
    const {id, admin} = req.body;
    const user = await User.findById(id);
    user.admin = admin;
    await user.save();
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// PUT /users/email
// Change user email
router.put('/users/email', auth, async(req, res) => {
  try {
    const {email} = req.body;
    if (!validator.isEmail(email)) {
      res.status(500).send("Fatal: email invalid");
    }
    req.user.email = email;
    await req.user.save();
    const user = req.user;
    res.status(200).send({user});
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// PUT /users/password
// Change user password
router.put('/users/password', auth, async(req, res) => {
  try {
    const {password} = req.body;
    req.user.password = password;
    await req.user.save();
    const user = req.user;
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// PUT /users/bio
// Change user bio
router.put('/users/bio', auth, async(req, res) => {
  try {
    const {bio} = req.body;
    req.user.bio = bio;
    await req.user.save();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

// POST /uniqueemail
// Check if email is unique
router.post('/uniqueemail', async(req, res) => {
  try {
    const _email = req.body.email;
    const user = await User.findOne({email: _email});
    const app = await Application.findOne({email: _email});
    if (user || app) {
      res.status(201).send("false");
    } else {
      res.status(201).send("true");
    }
  } catch (error) {
    res.status(500).send("Fatal: caught error. Msg: " + error);
  }
})

module.exports = router;