const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment')
const Reply = require('./reply');
const { cloudinary } = require('../cloudinary');

const ImageSchema = new Schema({
    url: String,
    filename: String
});


ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const BlogSchema = new Schema({

    title: String,
    body: String,
    images: [ImageSchema],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updateBlog: {
        type: String
    },
    likeCount: {
        type: Number,
        default: 0
    },
    dislikeCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })


BlogSchema.virtual('date').get(function () {

    const d = new Date();
    let z = parseInt((d.getTime() - this.updatedAt.getTime()) / (1000));
    let s = "";
    if (z >= 60 * 60 * 24 * 30 * 12) {
        z = parseInt(z / (60 * 60 * 24 * 30 * 12));
        s = " Year Ago"
    }
    else if (z >= 60 * 60 * 24 * 30) {
        z = parseInt(z / (60 * 60 * 24 * 30));
        s = " Month Ago"
    }
    else if (z >= 60 * 60 * 24) {
        z = parseInt(z / (60 * 60 * 24));
        s = " Days Ago"
    }
    else if (z >= 60 * 60) {
        z = parseInt(z / (60 * 60));
        s = " Hour Ago"
    }
    else if (z >= 60) {
        z = parseInt(z / 60)
        s = " Minute Ago"
    }
    else {
        s = " Sec Ago"
    }
    return z + s;
})

BlogSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        for (let comment of doc.comments) {
            await Comment.findByIdAndDelete(comment._id);
        }

        for (let img of doc.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
        const users = await User.find({});
        for (let user of users) {
            await user.updateOne({
                $pull: { likedBlogs: { $in: doc._id } },
            });
            await user.updateOne({
                $pull: { dislikedBlogs: { $in: doc._id } },
            });
        }
    }
    //write logic for cloudinary deletion of image when blog deleted

})
module.exports = mongoose.model('Blog', BlogSchema);