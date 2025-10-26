import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/",todoRoutes)

app.use(errorHandler);

export default app;