import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import postRoutes from "./routes/order.js";
import userRouter from "./routes/user.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true, type: "*/*" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/orders", postRoutes);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to SCB+ Api");
});

const PORT = process.env.PORT;

mongoose
  .connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log("server running on port: " + PORT))
  )
  .catch((err) => console.log(err.message));
