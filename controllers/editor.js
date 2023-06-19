import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import jwt from "jsonwebtoken";
import he from "he";
const bcrypt = require("bcryptjs");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
import { body, validationResult } from "express-validator";
import "dotenv/config";

const postDecoder = function(post) {
  post.title = he.decode(post.title);
  post.content = he.decode(post.content);
  return post;
};

const postsDecoder = function(posts) {
  let postsarray = [];
  posts.forEach((post) => {
    post.title = he.decode(post.title);
    post.content = he.decode(post.content);
    postsarray.push(post);
  });
  return postsarray;
};

const commentDecoder = function(comments) {
  let commentarray = [];
  comments.forEach((comment) => {
    comment.reader_username = he.decode(comment.reader_username);
    comment.content = he.decode(comment.content);
    commentarray.push(comment);
  });
  return commentarray;
};

//
exports.new_post_get = (req, res, next) => {
  return res.status(200);
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

exports.create_user_get = async function(req, res, next) {
  // check if there's a user on database. if there is, do not allow user creation
  try {
    const user = await User.findOne().exec();
    if (!user) {
      // allow user creation
      return res.status(200);
    } else {
      return res
        .status(403)
        .json({ message: "The creation of new users isn't available." });
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

exports.create_user_post = async function(req, res, next) {
  try {
    const user = await User.findOne().exec();
    if (!user) {
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
          return res
            .status(200)
            .json({ message: "user created", user: author_name });
        } catch (err) {
          return next(err);
        }
      });
    } else {
      return res
        .status(403)
        .json({ message: "The creation of new users isn't available." });
    }
  } catch (err) {
    return next(err);
  }
};

exports.update_post_get = async function(req, res, next) {
  const postid = req.params.postid;
  try {
    const post = await Post.findById(postid).exec();
    const postDecoded = postDecoder(post);
    const comments = await Comment.find({ post: postid })
      .sort({ date: -1 })
      .exec();
    const commentsDecoded = commentDecoder(comments);
    return res.json({ post: postDecoded, comments: commentsDecoded });
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
    .escape()
    .trim()
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
    const post = await Post.findById(req.params.postid).exec();
    const comments = post.comments;
    try {
      await Comment.deleteMany({ _id: { $in: comments } }).exec();
      try {
        await Post.findByIdAndDelete(req.params.postid).exec();
        return res.status(200).json({ message: "Post deleted" });
      } catch (err) {
        return res.status(400).json({ message: "Couldn't delete post" });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Couldn't delete comments" });
    }
  } catch (err) {
    return res.status(400).json({ message: "post not found" });
  }
};

exports.delete_comment = async function(req, res, next) {
  try {
    const post = await Post.findById(req.params.postid).exec();
    const commentid = req.params.commentid;
    const findcommentinpost = (element) =>
      element.toString() === req.params.commentid;
    post.comments.splice(post.comments.findIndex(findcommentinpost), 1);
    try {
      await Post.findByIdAndUpdate(req.params.postid, {
        $set: { comments: post.comments },
      });
      try {
        await Comment.findByIdAndDelete(req.params.commentid);
        return res.status(200).json({ message: "Comment deleted" });
      } catch (err) {
        return res.status(400).json({ message: "couldn't delete comment" });
      }
    } catch (err) {
      return res.status(400).json({ message: "couldn't update post" });
    }
  } catch (err) {
    return res.status(400).json({ message: "couldn't find post" });
  }
};

// get all posts
exports.posts_get = async function(req, res, next) {
  try {
    const posts = await Post.find({}).sort({ date: -1 }).exec();
    const postsDecoded = postsDecoder(posts);
    return res.json({ posts: postsDecoded });
  } catch (err) {
    return res.status(400).json({ message: "couldn't fetch posts" });
  }
};

// get all comments from post

exports.comments_get = async function(req, res, next) {
  try {
    const comments = await Comment.find({ post: req.params.postid })
      .sort({ date: -1 })
      .exec();
    const commentsDecoded = commentDecoder(comments);
    return res.status(200).json({ comments: commentsDecoded });
  } catch (err) {
    return res.status(400).json({ message: "couldn't fetch comments" });
  }
};
