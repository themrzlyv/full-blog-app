import { createPost, deletePost, getAllPosts, getSinglePost, updatePost } from 'controllers/post.controller';
import express, { Router } from 'express';
import { accessUser } from 'middlewares/accessUser';

const postRouter:Router = express.Router();

postRouter.get("/", getAllPosts);
postRouter.get("/:id", getSinglePost);
postRouter.post("/create", accessUser, createPost);
postRouter.put("/:id", accessUser, updatePost);
postRouter.delete("/:id", accessUser, deletePost);

export default postRouter;