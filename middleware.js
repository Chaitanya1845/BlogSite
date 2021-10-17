const { blogSchema, commentSchema, replySchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError.js');
const Blog = require('./models/blog');
const Comment = require('./models/comment');
const Reply = require('./models/reply');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'you must be signed in first');
        return res.redirect('/login');
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {

    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!req.user._id || !blog.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/blogs/${id}`);
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!req.user._id || !comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/blogs/${id}`);
    }
    next();
}

module.exports.validateBlog = (req, res, next) => {
    const { error } = blogSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.validateReply = (req, res, next) => {
    const { error } = replySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


module.exports.isReplyAuthor = async (req, res, next) => {
    const { id, replyId } = req.params;
    const reply = await Reply.findById(replyId);
    if (!req.user._id || !reply.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/blogs/${id}`);
    }
    next();
}