import mongoose from "mongoose";
import { DateTime } from "luxon";

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    reader_email: { type: String, maxLength: 50 },
    reader_username: { type: String, required: true, maxLength: 50 },
    content: { type: String, maxLength: 300 },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    date: { type: Date, default: Date.now },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

CommentSchema.virtual("comment_timestamp").get(function() {
  return DateTime.fromJSDate(this.date)
    .setLocale("en-gb")
    .toLocaleString(DateTime.DATETIME_SHORT);
});

module.exports = mongoose.model("Comment", CommentSchema);
