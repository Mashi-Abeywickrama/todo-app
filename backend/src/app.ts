import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
   console.log("GET / route was called");
  res.send("Server is running!");
});


export default app;