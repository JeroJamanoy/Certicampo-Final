import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
    getPosts,
    createPost,
    likePost,
    addComment
} from "../controllers/posts.controller.js";

const router = Router();

router.get("/", authRequired, getPosts);
router.post("/", authRequired, createPost);
router.post("/:id/like", authRequired, likePost);
router.post("/:id/comments", authRequired, addComment);

export default router; 