import Post from "../models/Post.model.js";

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name')
            .populate('comments.author', 'name')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    try {
        const { content, category, tags = [], images = [] } = req.body;
        const newPost = new Post({
            content,
            category,
            tags,
            images,
            author: req.user.id
        });
        const savedPost = await newPost.save();
        const populatedPost = await Post.findById(savedPost._id)
            .populate('author', 'name')
            .populate('comments.author', 'name');
        res.json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post no encontrado" });
        }

        const likeIndex = post.likes.indexOf(req.user.id);
        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(req.user.id);
        }

        await post.save();
        const updatedPost = await Post.findById(post._id)
            .populate('author', 'name')
            .populate('comments.author', 'name');
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post no encontrado" });
        }

        const { content } = req.body;
        post.comments.push({
            content,
            author: req.user.id,
            createdAt: new Date()
        });

        await post.save();
        const updatedPost = await Post.findById(post._id)
            .populate('author', 'name')
            .populate('comments.author', 'name');
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 