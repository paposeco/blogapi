import Post from "../models/post";
import Comment from "../models/comment";

exports.homepage = (req, res, next) => {
  return res.send("Blog\n");
};

exports.single_post_get = async function(req, res, next) {
  try {
    const post = await Post.findById(req.params.postid)
      .populate("comments")
      .exec();
    return res.status(200).json({ post });
  } catch (err) {
    return res.status(400).json({ message: "couldn't fetch post" });
  }
};

exports.posts_get = async function(req, res, next) {
  try {
    const posts = await Post.find({})
      .sort({ date: 1 })
      .populate("comments")
      .exec();
    console.log(posts);
    return res.status(200).json({ posts });
  } catch (err) {
    return res.status(400).json({ message: "couldn't fetch posts" });
  }
};
