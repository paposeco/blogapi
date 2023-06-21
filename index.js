import "dotenv/config";
import express from "express";
import cors from "cors";
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
import compression from "compression";
import helmet from "helmet";
import mongoose from "mongoose";
import path from "path";
import passport from "passport";
import RateLimit from "express-rate-limit";

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const app = express();

app.use(helmet());
app.use(compression());
app.use(passport.initialize());

// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// router
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/", postRouter);

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

// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

// Listen on `port` and 0.0.0.0
app.listen(port, "0.0.0.0", function() {
  // ...
});
