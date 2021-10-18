const Comment = require('../models/comment');
const Blog = require('../models/blog');


module.exports.createComment = async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    const comment = await new Comment(req.body.comment);
    comment.author = req.user._id;
    blog.comments.push(comment);
    await comment.save();
    await blog.save({ timestamps: { createdAt: true, updatedAt: false } });

    req.flash('success', 'Created new comment!');
    res.redirect(`/blogs/${id}`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Blog.findByIdAndUpdate(id, { $pull: { comments: commentId } }, { timestamps: { createdAt: true, updatedAt: false } });
    await Comment.findByIdAndDelete(commentId);

    req.flash('success', 'Succesfully deleted comment!');
    res.redirect(`/blogs/${id}`);
}