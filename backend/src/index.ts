import express from "express";
import cors from "cors";
import { config } from "dotenv";

config()

const app = express();
app.use(express.json());

// Require ORIGIN to be defined
const ORIGIN = process.env.ORIGIN;
if (!ORIGIN) {
  throw new Error("❌ Environment variable ORIGIN is not defined.");
}

app.use(
  cors({
    origin: ORIGIN,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    optionsSuccessStatus: 200,
  })
);
import todoRouter from "./routes/todo.route";
app.use("/api", todoRouter);

app.get("/", (req, res) => {
  res.send({ message: "Backend is up." });
});

app.get("/health", (req, res) => {
  res.send({ message: "Backend is healthy and running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is up and running in the port ${PORT}`);
});
