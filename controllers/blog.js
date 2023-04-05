import Post from "../models/post";
import Comment from "../models/comment";

exports.homepage = (req, res, next) => {
  return res.send("Blog\n");
};

exports.single_post_get = (req, res, next) => {
  return res.send("a post\n");
};
