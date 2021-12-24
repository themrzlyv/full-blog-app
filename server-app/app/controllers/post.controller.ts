import { prisma } from 'config/config';
import { NextFunction, Request, Response } from 'express';
import ApiError from 'middlewares/ApiError';
import { nextTick } from 'process';
import { checkData } from 'services/utils/functions';

export const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: [{ title: 'asc' }],
      include: {
        category: { select: { category: { select: { name: true } } } },
        author: { select: { name: true, email: true } },
      },
    });
    res.status(200).json({ length: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

export const getSinglePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: { select: { category: { select: { name: true } } } },
        author: { select: { name: true, email: true } },
      },
    });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, categoryCodes, userId } = req.body;
    if (!title || !description || !categoryCodes || !userId)
      return next(ApiError.badRequest(400, 'Please fill all inputs!'));
    await prisma.post.create({
      data: {
        title,
        description,
        userId,
        category: {
          create: categoryCodes?.map((id: number) => ({ categoryId: id })),
        },
      },
    });
    res.status(201).json({ message: 'Post was created!' });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = checkData(req.body);
    await prisma.post.update({
      where: { id: Number(id) },
      data: {
        ...data,
      },
    });
    res.status(200).json({ message: 'Post was updated!' });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: 'Post was deleted!' });
  } catch (error) {
    next(error);
  }
};
