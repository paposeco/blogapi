import express from "express";
import blog from "../controllers/blog";
import editor from "../controllers/editor";
import passport from "passport";
import { decodeToken } from "./auth.js";

const router = express.Router();

router.get("/", blog.posts_get);
router.get("/blog/:pagenumber", blog.posts_get_withpage);
router.get("/totalposts", blog.count_posts_get);
router.get("/editor/createuser", editor.create_user_get);
router.post("/editor/createuser", editor.create_user_post);

export default router;
