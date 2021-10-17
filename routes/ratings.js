const express = require('express');
const router = express.Router({ mergeParams: true });
const ratings = require('../controllers/ratings');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

router.post('/:userId/l', isLoggedIn, catchAsync(ratings.likes));
router.post('/:userId/d', isLoggedIn, catchAsync(ratings.dislike));

module.exports = router;