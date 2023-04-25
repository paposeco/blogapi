import express from "express";
import blog from "../controllers/blog";
import comments from "../controllers/comments";
import editor from "../controllers/editor";
import passport from "passport";
import { decodeToken } from "./auth.js";

const router = express.Router();

router.get("/posts/:postid", blog.single_post_get);

router.get("/posts/:postid/comments/newcomment", comments.new_comment_get);
router.post("/posts/:postid/comments/newcomment", comments.new_comment_post);
router.get("/posts/:postid/comments/:commentid", comments.single_comment_get);
router.get("/posts/:postid/comments", comments.comments_get);

// new post
router.get(
  "/editor/newpost",
  passport.authenticate("jwt", { session: false }),
  editor.new_post_get
);

router.post(
  "/editor/newpost",
  passport.authenticate("jwt", { session: false }),
  decodeToken,
  editor.new_post_post
);

// editor all posts

router.get(
  "/editor/posts",
  passport.authenticate("jwt", { session: false }),
  decodeToken,
  editor.posts_get
);

// all comments for post

// edit posts
router.get(
  "/editor/posts/:postid",
  passport.authenticate("jwt", { session: false }),
  editor.update_post_get
);

router.put(
  "/editor/posts/:postid",
  passport.authenticate("jwt", { session: false }),
  decodeToken,
  editor.update_post_put
);

router.delete(
  "/editor/posts/:postid",
  passport.authenticate("jwt", { session: false }),
  decodeToken,
  editor.delete_post_delete
);

// delete comments

router.get(
  "/editor/posts/:postid/comments/:commentid",
  passport.authenticate("jwt", { session: false }),
  decodeToken,
  editor.get_comment
);

router.delete(
  "/editor/posts/:postid/comments/:commentid",
  passport.authenticate("jwt", { session: false }),
  decodeToken,
  editor.delete_comment
);

export default router;
