const express = require('express');
const router = express.Router();

const userRoute = require('./src/controller/user/route');
const tokenRoute = require('./src/controller/token/route');

router.use('/user', userRoute);
router.use('/token', tokenRoute);

module.exports = router;