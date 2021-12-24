import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  putCategory,
} from 'controllers/category.controller';
import express, { Router } from 'express';
import { accessAdmin } from 'middlewares/accessAdmin';
import { accessUser } from 'middlewares/accessUser';

const categoryRouter: Router = express.Router();

categoryRouter.get('/', getAllCategories);
categoryRouter.get('/:id', getSingleCategory);
categoryRouter.post('/create', accessUser, accessAdmin, createCategory);
categoryRouter.put('/:id', accessUser, accessAdmin, putCategory);
categoryRouter.delete('/:id', accessUser, accessAdmin, deleteCategory);

export default categoryRouter;
