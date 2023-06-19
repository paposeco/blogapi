import express from "express";
import passport from "passport";
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
import User from "../models/user";
import jwt from "jsonwebtoken";
import "dotenv/config";
//require("../passport.js");

const router = express.Router();

passport.use(
  new LocalStrategy(async function verify(username, password, done) {
    try {
      const user = await User.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match
          return done(null, user);
        } else {
          return done(null, false, { message: "Wrong password" });
        }
      });
    } catch (err) {
      if (err) {
        return done(err);
      }
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWTSECRET,
    },
    function(jwtPayload, cb) {
      return cb(null, "goodstuff\n");
    }
  )
);

export function decodeToken(req, res, next) {
  const decoded = jwt.verify(req.body.token, process.env.JWTSECRET);
  req.body.author = decoded.author_name;
  req.body.username = decoded.username;
  next();
}

router.post("/editor/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right\n",
        user: user,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
        return;
      }
      // generate a signed json web token with the contents of user object and return it in the response
      const token = jwt.sign(
        { author_name: user.author_name, username: req.body.username },
        process.env.JWTSECRET
      );
      return res.json({ token: token, author: user.author_name });
    });
  })(req, res);
});

export default router;
