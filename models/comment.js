import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  reader_email: { type: String },
  reader_username: { type: String, required: true },
  content: { type: String, maxLength: 200 },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
});

module.exports = mongoose.model("Comment", CommentSchema);
