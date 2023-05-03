import express from "express";
import blog from "../controllers/blog";
import comments from "../controllers/comments";
import editor from "../controllers/editor";
import passport from "passport";
import { decodeToken } from "./auth.js";

const router = express.Router();

router.get("/posts/:postid", blog.single_post_get);
router.get("/posts", blog.posts_get);

router.post("/posts/:postid/newcomment", comments.new_comment_post);

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

// all comments for post

router.get(
  "/editor/posts/:postid/comments",
  passport.authenticate("jwt", { session: false }),
  editor.comments_get
);

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

/* router.get(
 *   "/editor/posts/:postid/comments/:commentid",
 *   passport.authenticate("jwt", { session: false }),
 *   editor.get_comment
 * ); */

router.delete(
  "/editor/posts/:postid/comments/:commentid",
  passport.authenticate("jwt", { session: false }),
  decodeToken,
  editor.delete_comment
);

// editor all posts

router.get(
  "/editor/posts",
  passport.authenticate("jwt", { session: false }),
  editor.posts_get
);

export default router;
