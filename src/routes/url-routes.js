import express from "express";
const router = express.Router();
import {
  shortenUrl,
  redirectUser,
  allUrls,
  deleteUrl,
  allUserUrls
} from "../controllers/index.js";
import { ensureAuthenticated } from "../middlewares/index.js";

router.post("/shorten", ensureAuthenticated, shortenUrl);
router.get("/", redirectUser);
router.get("/urls", ensureAuthenticated, allUrls);
router.get("/urls/:id", ensureAuthenticated, allUserUrls);
router.delete("/:id", ensureAuthenticated, deleteUrl);

export { router };
