import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import jwt from "jsonwebtoken";
const bcrypt = require("bcryptjs");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
import { body, validationResult } from "express-validator";
import "dotenv/config";

exports.new_post_get = (req, res, next) => {
  // front end must send the token on the header. get's checked on the previous middleware. get method doesn't have a request body.
  return res.json({ user: true });
};

exports.new_post_post = [
  body("title")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Post title is required")
    .isLength({ max: 100 })
    .withMessage("Post title must be less than 100 characters"),
  body("content")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Post can't be empty"),
  async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array(), postcontent: req.body });
    }
    try {
      const userondb = await User.findOne({ email: req.body.username });
      if (!userondb) {
        return res.status(400).json({ message: "User not found on DB" });
      } else {
        const blogpost = new Post({
          title: req.body.title,
          author: userondb._id,
          content: req.body.content,
          draft: req.body.draft,
        });
        try {
          await blogpost.save();
          return res.status(201).json({ posturl: blogpost.url });
        } catch (err) {
          return res.status(400).json({ message: "Couldn't save post to db" });
        }
      }
    } catch (err) {
      return res.status(400).json({ message: "DB error" });
    }
  },
];

exports.login_get = (req, res, next) => {
  return res.status(200);
};

exports.logout_get = (req, res, next) => {
  // token was valid, user was logged in and can now log out
  return res.status(200);
};

exports.create_user_get = (req, res, next) => {
  // not available to the general public
  return res
    .status(403)
    .json({ message: "The creation of new users isn't available." });
};

exports.create_user_post = async function(req, res, next) {
  try {
    bcrypt.hash(req.body.password, 10, async function(err, hashedpassword) {
      if (err) {
        return next(err);
      }
      const newuser = new User({
        email: req.body.email,
        password: hashedpassword,
        author_name: req.body.name,
      });
      try {
        await newuser.save();
        return res.send(`${newuser}\n`);
      } catch (err) {
        return next(err);
      }
    });
  } catch (err) {
    return next(err);
  }
};

// change draft to false

exports.update_post_get = async function(req, res, next) {
  const postid = req.params.postid;
  try {
    const post = await Post.findById(postid);
    return res.json({ post });
  } catch (err) {
    return res.json({ message: err });
  }
};

exports.update_post_put = [
  body("title")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Post title is required")
    .isLength({ max: 100 })
    .withMessage("Post title must be less than 100 characters"),
  body("content")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Post can't be empty"),
  async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array(), postcontent: req.body });
    }
    try {
      const userondb = await User.findOne({ email: req.body.username });
      const oldpost = await Post.findById(req.params.postid);
      const commentsArray = oldpost.comments;
      const post = new Post({
        title: req.body.title,
        author: userondb._id,
        content: req.body.content,
        draft: req.body.draft,
        comments: commentsArray,
        _id: req.params.postid,
      });
      try {
        await Post.findByIdAndUpdate(req.params.postid, post);
        return res.status(201).json({ message: "post updated" });
      } catch (err) {
        return res.status(400).json({ message: "Couldn't update post" });
      }
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },
];

exports.delete_post_delete = async function(req, res, next) {
  try {
    const post = await Post.findById(req.params.postid);
    const comments = post.comments;
    try {
      await Comments.deleteMany({ _id: { $in: { comments } } });
      try {
        await Post.findByIdAndDelete(req.params.postid);
        res.status(200).json({ message: "Post deleted" });
      } catch (err) {
        return res.status(400).json({ message: "Couldn't delete post" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Couldn't delete comments" });
    }
  } catch (err) {
    return res.status(400).json({ message: "post not found" });
  }
};

exports.delete_comment = (req, res, next) => {
  return res.send("Delete comment");
};
