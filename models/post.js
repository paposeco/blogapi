import mongoose from "mongoose";
import { DateTime } from "luxon";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  content: { type: String, required: true },
  draft: { type: Boolean, default: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

PostSchema.virtual("post_timestamp").get(function() {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_SHORT);
});

module.exports = mongoose.model("Post", PostSchema);
