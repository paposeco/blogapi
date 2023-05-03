import Comment from "../models/comment";
import Post from "../models/post";
import { body, validationResult } from "express-validator";

exports.new_comment_post = [
  body("reader_email")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isLength({ max: 50 })
    .withMessage("Email is too long")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("reader_username")
    .trim()
    .escape()
    .isLength({ max: 50 })
    .withMessage("Username should be less than 50 characters")
    .isLength({ min: 1 })
    .withMessage("Please provide a username"),
  body("content")
    .trim()
    .escape()
    .isLength({ max: 300 })
    .withMessage("Comments must be less than 300 characters")
    .isLength({ min: 1 })
    .withMessage("Comments can't be empty"),
  async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array(), postcontent: req.body });
    }
    try {
      const post = await Post.findById(req.params.postid).exec();
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      } else {
        try {
          let newcomment;
          if (req.body.reader_email !== "") {
            newcomment = new Comment({
              reader_email: req.body.reader_email,
              reader_username: req.body.reader_username,
              content: req.body.content,
              post: post._id,
            });
          } else {
            newcomment = new Comment({
              reader_username: req.body.reader_username,
              content: req.body.content,
              post: post._id,
            });
          }
          await newcomment.save();
          try {
            await Post.findByIdAndUpdate(req.params.postid, {
              $push: { comments: newcomment._id },
            }).exec();
            return res.status(201);
          } catch (err) {
            return res
              .status(400)
              .json({ message: "Couldn't save comment to post" });
          }
        } catch (err) {
          return res
            .status(400)
            .json({ message: "Couldn't save comment to db" });
        }
      }
    } catch (err) {
      return res.status(400).json({ message: "DB error" });
    }
  },
];
