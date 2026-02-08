import express from "express";
const router = express.Router();
import {
  shortenUrl,
  redirectUser,
  allUrls,
  deleteUrl,
} from "../controllers/index.js";
import { ensureAuthenticated } from "../middlewares/index.js";

router.post("/shorten", ensureAuthenticated, shortenUrl);
router.get("/", redirectUser);
router.get("/urls", ensureAuthenticated, allUrls);
router.delete("/:id", ensureAuthenticated, deleteUrl);

export { router };
