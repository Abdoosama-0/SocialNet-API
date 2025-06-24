const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment:{type:String},
    commentImage:{type:String},
}, { timestamps: true });


const postSchema = new Schema({

    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    title: {type: String},

    images: [{ type: String }],

    comments: [commentSchema],

    createdAt: { type: Date, default: Date.now },

    likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    likesCount:{type:Number,default:0}

}, { timestamps: true });

const Post = mongoose.model('Post', postSchema)
module.exports = Post