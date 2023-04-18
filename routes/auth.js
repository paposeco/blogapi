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
require("../passport.js");

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

// middleware that allows only requests with valid tokens to access routes needing authentication
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

// curl -X POST -H "Content-Type:application/json" http://localhost.localdomain:3000/editor/login -d '{"username": "xxx", "password": "xxx"}'
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
      }
      // generate a signed json web token with the contents of user object and return it in the response
      const token = jwt.sign(
        { author_name: user.author_name },
        process.env.JWTSECRET
      );
      return res.json({ token });
    });
  })(req, res);
});

//  I can now use this pass.authenticate jwt on every route that requires authentication, or I can use the verify function of the guy on the video

router.post("/editor/logout", (req, res) => {
  return res.send("logout");
});

export default router;
