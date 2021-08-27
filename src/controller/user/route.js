const express = require('express');
const router = express.Router();
const user = require('./service');

router.route('/')
    .get(user.test)

module.exports = router;