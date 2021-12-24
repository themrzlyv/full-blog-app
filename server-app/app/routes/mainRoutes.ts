import express, { Router } from 'express';
import adminRouter from 'routes/adminRoutes';
import authRouter from 'routes/authRoutes';
import categoryRouter from 'routes/categoryRoutes';
import postRouter from 'routes/postRoutes';
import userRouter from 'routes/userRoutes';

const mainRoutes: Router = express.Router();

mainRoutes.use("/auth", authRouter);
mainRoutes.use("/user", userRouter);
mainRoutes.use("/admin", adminRouter);
mainRoutes.use("/category",categoryRouter);
mainRoutes.use("/post", postRouter);

export default mainRoutes;