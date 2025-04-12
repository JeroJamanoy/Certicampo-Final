import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        content: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    images: [{
        type: String
    }],
    tags: [{
        type: String
    }],
    category: {
        type: String,
        required: true,
        enum: ['general', 'cultivos', 'mercado', 'tecnologia']
    }
}, {
    timestamps: true
});

export default mongoose.model("Post", postSchema); 