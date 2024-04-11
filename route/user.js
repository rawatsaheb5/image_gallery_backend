const express = require('express');
const {signup, signin } = require('../controller/user');
const router = express.Router();


// Register
router.post('/signup', signup);
router.post('/signin', signin);


module.exports = router;
