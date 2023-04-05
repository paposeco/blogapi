import express from "express";
import blog from "../controllers/blog";
import editor from "../controllers/editor";

const router = express.Router();

router.get("/", blog.homepage);
router.get("/posts", blog.homepage);

router.get("/editor/login", editor.login_get);
router.get("/editor/logout", editor.logout_get);
router.get("/editor/createuser", editor.create_user_get);
router.post("/editor/createuser", editor.create_user_post);

export default router;
