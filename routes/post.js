import express from "express";
import blog from "../controllers/blog";
import comments from "../controllers/comments";
import editor from "../controllers/editor";
import passport from "passport";
import { decodeToken } from "./auth.js";

const router = express.Router();

router.get("/posts/:postid", blog.single_post_get);

router.delete("/posts/:postid/comments/:commentid", editor.delete_comment);
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

// not sure what's happening with router.post. used to work and now it doesn't. smells like a trivial bug
/* router.post("/editor/newpost", (req, res) => {
 *   console.log("??????");
 *   res.json({ message: "ok" });
 * }); */

/* router.post(
 *   "/editor/newpost",
 *   passport.authenticate("jwt", { session: false }),
 *   decodeToken,
 *   editor.new_post_post
 * ); */

// edit
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

export default router;
