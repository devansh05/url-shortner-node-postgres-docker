import express from "express";
const router = express.Router();
import { signUpUser } from "../controllers/index.js";

router.post("/signup", signUpUser);

export { router };
