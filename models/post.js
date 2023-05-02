import mongoose from "mongoose";
import { DateTime } from "luxon";

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true, maxLength: 100 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    draft: { type: Boolean, default: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

PostSchema.virtual("post_timestamp").get(function() {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_SHORT);
});

PostSchema.virtual("url").get(function() {
  return `/blog/posts/${this._id}`;
});

PostSchema.virtual("urleditor").get(function() {
  return `/editor/posts/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);
