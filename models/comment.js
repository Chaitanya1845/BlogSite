const mongooose = require('mongoose');
const Schema = mongooose.Schema;
const Reply = require('./reply');

const CommentSchema = new Schema({
    text: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reply'
        }
    ]
}, { timestamps: true })


CommentSchema.virtual('date').get(function () {

    const d = new Date();
    let z = parseInt((d.getTime() - this.updatedAt.getTime()) / (1000));
    let s = "";

    if (z >= 60 * 60 * 24 * 7) {
        z = parseInt(z / (60 * 60 * 24 * 7));
        s = "w"
    }
    else if (z >= 60 * 60 * 24) {
        z = parseInt(z / (60 * 60 * 24));
        s = "d "
    }
    else if (z >= 60 * 60) {
        z = parseInt(z / (60 * 60));
        s = "h "
    }
    else if (z >= 60) {
        z = parseInt(z / 60)
        s = "m"
    }
    else {
        s = "s "
    }
    return z + s;
})

CommentSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Reply.deleteMany({

            _id: {
                $in: doc.replies
            }
        })
    }
    //write logic for cloudinary deletion of image when blog deleted

})
CommentSchema.pre('deleteMany', async function (doc) {

    console.log(doc);
})
module.exports = mongooose.model('Comment', CommentSchema);

