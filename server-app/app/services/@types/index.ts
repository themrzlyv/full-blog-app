import { Request } from 'express';

export interface iCategory {
  id?: number;
  name?: string;
  about?: string;
  posts?: iPost[];
}

export interface iPost {
  id?: number;
  title?: string;
  description?: string;
  category?: iCategory[];
  author?: iUser;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface iUser {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  posts?: iPost[];
  role?: 'User' | 'Admin';
  createdAt?: Date;
}

export interface iReqAuth extends Request {
  user?: iUser;
}

export interface IDecodedToken {
  id?: string
  user?: iUser
  iat: number
  exp: number
}