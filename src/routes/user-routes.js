import express from "express";
const router = express.Router();
import { signUpUser, loginUser } from "../controllers/index.js";

router.post("/signup", signUpUser);
router.get("/login", loginUser);

export { router };
