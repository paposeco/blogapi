import express from "express";
import passport from "passport";
import User from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/editor/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      // generate a signed son web token with the contents of user object and return it in the response

      const token = jwt.sign(user, "your_jwt_secret");
      return res.json({ user, token });
    });
  })(req, res);
});

router.post("/editor/logout", (req, res) => {
  return res.send("logout");
});

export default router;
