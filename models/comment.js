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
    if (z >= 60 * 60 * 24 * 30 * 12) {
        z = parseInt(z / (60 * 60 * 24 * 30 * 12));
        s = "Year Ago"
    }
    else if (z >= 60 * 60 * 24 * 30) {
        z = parseInt(z / (60 * 60 * 24 * 30));
        s = "Month Ago"
    }
    else if (z >= 60 * 60 * 24) {
        z = parseInt(z / (60 * 60 * 24));
        s = " No. of Days Ago"
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

