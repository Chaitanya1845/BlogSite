const express = require('express');
const router = express.Router({ mergeParams: true });
const replies = require('../controllers/replies');
const catchAsync = require('../utils/catchAsync');
const { validateReply, isLoggedIn, isReplyAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReply, catchAsync(replies.createReply));
router.delete('/:replyId', isReplyAuthor, isLoggedIn, catchAsync(replies.deleteReply));

module.exports = router;