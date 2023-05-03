import Post from "../models/post";
import Comment from "../models/comment";
import he from "he";

const commentDecoder = function(comments) {
  let commentarray = [];
  comments.forEach((comment) => {
    comment.reader_username = he.decode(comment.reader_username);
    comment.content = he.decode(comment.content);
    commentarray.push(comment);
  });
  return commentarray;
};

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

// returns single post
exports.single_post_get = async function(req, res, next) {
  try {
    const post = await Post.findById(req.params.postid).exec();
    const postDecoded = postDecoder(post);
    const comments = await Comment.find({ post: req.params.postid })
      .sort({
        date: -1,
      })
      .exec();
    const commentsDecoded = commentDecoder(comments);
    return res
      .status(200)
      .json({ post: postDecoded, comments: commentsDecoded });
  } catch (err) {
    return res.status(400).json({ message: "couldn't fetch post" });
  }
};

// returns every published post
exports.posts_get = async function(req, res, next) {
  try {
    const posts = await Post.find({ draft: false })
      .sort({ date: -1 })
      .populate("comments")
      .exec();
    const postsDecoded = postsDecoder(posts);
    return res.status(200).json({ posts: postsDecoded });
  } catch (err) {
    return res.status(400).json({ message: "couldn't fetch posts" });
  }
};
