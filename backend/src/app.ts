import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import healthRouter from "./routes/health.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import authRoutes from './routes/auth.routes';

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", healthRouter);
app.use('/api/auth', authRoutes);

app.use(helmet()); 

app.use(cors());

app.use(morgan("dev"));

app.use(compression());

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Site Achat API is running",
  });
});

import { errorHandler } from "./middlewares/error.middleware";

// ...

app.use(errorHandler);

export default app;