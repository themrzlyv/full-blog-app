import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import mainRoutes from 'routes/mainRoutes';
import errorHandler from 'middlewares/errorHandler';

dotenv.config();

const app: Application = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan logger is activated');
}

// routes
app.use('/v1', mainRoutes);

// global error handler
app.use(errorHandler);

const port: number = Number(process.env.PORT) || 3050;

app.listen(port, () => console.log(`Server is running on ${port}`));