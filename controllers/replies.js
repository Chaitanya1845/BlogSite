const Comment = require('../models/comment');
const Reply = require('../models/reply');

module.exports.createReply = async (req, res) => {
    const { commentId, id } = req.params;
    const comment = await Comment.findById(commentId);
    const reply = await new Reply(req.body.reply);
    reply.author = req.user._id;
    comment.replies.push(reply);
    await reply.save();
    await comment.save({ timestamps: { createdAt: true, updatedAt: false } });
    req.flash('success', 'Created new Reply!');
    res.redirect(`/blogs/${id}`);
}

module.exports.deleteReply = async (req, res) => {
    const { id, commentId, replyId } = req.params;
    await Comment.findByIdAndUpdate(commentId, { $pull: { replies: replyId } }, { timestamps: { createdAt: true, updatedAt: false } });
    await Reply.findByIdAndDelete(replyId);

    req.flash('success', 'Succesfully deleted reply!');
    res.redirect(`/blogs/${id}`);
}