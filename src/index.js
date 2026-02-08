import express from "express";
import { userRouter, urlRouter } from "./routes/index.js";
import { errorHandler } from "./middlewares/index.js";

const PORT = 3000;
const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/url", urlRouter);
app.use(errorHandler);

app.listen(PORT, () => console.log(`🟡 LOG - LISTENING ON PORT : `, PORT));
