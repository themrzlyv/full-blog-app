import { prisma } from 'config/config';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { loginValidator, regValidator } from 'services/helpers/validator';
import { generateJwt } from 'services/helpers/generateJwt';
import ApiError from 'middlewares/ApiError';
import { iReqAuth, iUser } from 'services/@types';
import { User } from '@prisma/client';

export const registrationUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // validation request's data
    const error = regValidator({ ...req.body });
    if (error) return next(ApiError.badRequest(400, error));

    // chekc user if exists
    const existUser = await prisma.user.findUnique({ where: { email } });
    if (existUser) return next(ApiError.badRequest(400, 'This email is already registered!'));

    // hashing password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // find user's id , generate token and send
    const user: iUser | null = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, posts: true, role: true, createdAt: true, },
    });
    if (!user) return next(ApiError.badRequest(400, 'Something went wrong!'));

    const token = generateJwt(user);
    return res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // validation request's data
    const error = loginValidator({ ...req.body });
    if (error) return next(ApiError.badRequest(400, error));

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        posts: true,
      },
    });
    if (!user) return next(ApiError.badRequest(400, "This user doesn't exists"));

    // control user password
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(ApiError.badRequest(400, 'Password is not valid'));

    const token = generateJwt(user);
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        posts: user.posts,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req: iReqAuth, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return next(ApiError.badRequest(403, 'Invalid Authentication.'));
    return res.status(200).json({ message: 'Logged out!' });
  } catch (error) {
    next(error);
  }
};
