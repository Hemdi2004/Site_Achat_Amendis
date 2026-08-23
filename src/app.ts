import express from 'express';
import authRoutes from './routes/auth.routes.js';
import tenderRoutes from './routes/tender.routes.js';
import bidRoutes from './routes/bid.routes.js';

import { errorHandler } from './middlewares/error.middleware.js';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec} from './docs/swagger.js';
import cors from 'cors';
import { env } from './config/env.js';

const app = express();// istantiates the express app to configure apps and middlewares
app.use(express.json());// used for parsing the body of incoming requests containing JSON

app.use(cors({origin: env.CORS_ORIGIN, credentials: true,}));


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));// swagger docs

app.use('/auth', authRoutes);
app.use('/tenders', tenderRoutes);
app.use('/api', bidRoutes);

app.use(errorHandler);//

export default app;

// SO THIS FILE IS USED AS A SEPARATE FROM THE SERVER.TS PREVIOUSLY THEY WERE MIXED TO EACH OTHER NOW WE HAVE SEPERATED THEM THE SERVER.TS IS ONLY RESPONSIBLE ON STARTING A SERVER, INITIALIZE EXTERNAL CONNECTIONS. THE APP.TS FOR CONFIGURING MIDDLEWARES, DECLARE API ROUTES, MANAGES THE CENTRALIZATION OF ERRORS, AND IT DOESNT LISTEN ON ANY PORTS IT SIMPLY EXPORTS THE OBJECT APP.   