import User from "../models/user";
import passport from "passport";
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async function verify(email, password, done) {
    try {
      const user = await User.findOne({ email: email });
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
