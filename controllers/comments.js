import Comment from "../models/comment";

exports.comments_get = (req, res, next) => {
  return res.send("comments");
};

exports.single_comment_get = (req, res, next) => {
  return res.send("a comment");
};

exports.new_comment_get = (req, res, next) => {
  return res.send("create a comment get");
};

exports.new_comment_post = (req, res, next) => {
  return res.send("create a comment post");
};
