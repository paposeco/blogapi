import express from "express";
import blog from "../controllers/blog";
import comments from "../controllers/comments";
import editor from "../controllers/editor";

const router = express.Router();

router.get("/posts/:postid", blog.single_post_get);
router.put("/posts/:postid", editor.update_post);
router.delete("/posts/:postid", editor.delete_post);
router.get("/posts/:postid/comments", comments.comments_get);
router.get("/posts/:postid/comments/:commentid", comments.single_comment_get);
router.delete("/posts/:postid/comments/:commentid", editor.delete_comment);
router.get("/posts/:postid/comments/newcomment", comments.new_comment_get);
router.post("/posts/:postid/comments/newcomment", comments.new_comment_post);

//new post

router.get("/posts/newpost", editor.new_post_get);
router.post("/posts/newpost", editor.new_post_post);

export default router;
