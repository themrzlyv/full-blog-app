import { prisma } from 'config/config';
import { NextFunction, Request, Response } from 'express';
import ApiError from 'middlewares/ApiError';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ name: 'asc' }],
    });
    res.status(200).json({ length: categories.length, categories });
  } catch (error) {
    next(error);
  }
};

export const getSingleCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: {
        posts: { include: { post: true } },
      },
    });
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    if (!name || !about) return next(ApiError.badRequest(400, 'Please fill all inputs!'));
    const existCategory = await prisma.category.findUnique({ where: { name } });
    if (existCategory) return next(ApiError.badRequest(400, 'This category already exists!'));
    await prisma.category.create({
      data: {
        name,
        about,
      },
    });
    res.status(201).json({ message: 'Category was created!' });
  } catch (error) {
    next(error);
  }
};

export const putCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, about } = req.body;
    if (!name || !about) return next(ApiError.badRequest(400, 'Please fill all inputs!'));
    const existNamedCategory = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!existNamedCategory) return next(ApiError.badRequest(400, "Category didn't find!"));
    if (name === existNamedCategory?.name)
      return next(ApiError.badRequest(400, 'The name same as older!'));
    await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name,
        about,
      },
    });
    res.status(200).json({ message: 'Category was updated!' });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Category deleted!' });
  } catch (error) {
    next(error);
  }
};
