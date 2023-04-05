import "dotenv/config";
import express from "express";
import cors from "cors";
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
import mongoose from "mongoose";
require("./passport");

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// router
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/", postRouter);

app.listen(process.env.PORT, () =>
  console.log("Example app listening on port 3000!")
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
