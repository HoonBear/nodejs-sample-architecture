const express = require('express');
const router = express.Router();
const token = require('./service');

router.route('/')
    .get(token.reissuanceToken)

module.exports = router;