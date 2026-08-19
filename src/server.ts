import express from 'express';
import { env } from './config/env.js';

import authRoutes from './routes/auth.routes.js';
import tenderRoutes from './routes/tender.routes.js';
import bidRoutes from './routes/bid.routes.js';

import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tenders', tenderRoutes);
app.use('/api', bidRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(
    `Server is running on http://localhost:${env.port}`
  );
});