import User from "../models/user";
import jwt from "jsonwebtoken";
const bcrypt = require("bcryptjs");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
import { body, validationResult } from "express-validator";
import "dotenv/config";

/* curl -H "Content-Type:application/json" -H "Authorization: Bearer xxx" http://localhost.localdomain:3000/editor/newpost */
// -X POST for post
exports.new_post_get = (req, res, next) => {
  // what happens here?
  // front end must display editing view if token is valid
  // once I develop the frontend I need to check if this makes sense

  // If I leave this here, it calls res.render for some reason. Need to find a way to access or keep the token payload

  return res.json({ user: true });
};

/* curl -H "Content-Type:application/json" -H "Authorization: Bearer xxx" -d '{"token": "xxx"}' http://localhost.localdomain:3000/editor/newpost
 *  */

exports.new_post_post = (req, res, next) => {
  //console.log(req.body.token);
  //console.log(jwt(req.body.token));
  return res.json({ oi: "New blog post post" });
};

/* exports.new_post_post = [
 *   body("title")
 *     .trim()
 *     .escape()
 *     .isLength({ min: 1 })
 *     .withMessage("Post title is required")
 *     .isLength({ max: 100 })
 *     .withMessage("Post title must be less than 100 characters"),
 *   body("content")
 *     .trim()
 *     .escape()
 *     .isLength({ min: 1 })
 *     .withMessage("Post can't be empty"),
 *   async function(req, res, next) {
 *     const errors = validationResult(req);
 *     if (!errors.isEmpty()) {
 *       return res.json({ errors: errors.array(), postcontent: req.body });
 *     }
 *     return res.json({ oi: "New blog post post" });
 *     //const decoded = jwt.verify()
 *     // i need the user
 *   },
 *
 *   jwt.verify(req.token, process.env.JWTSECRET, function(err, decoded) {
 *     console.log(decoded.author_name);
 *   });
 *   // save post to db
 * ]; */

exports.login_get = (req, res, next) => {
  return res.send("Login get");
};

exports.logout_get = (req, res, next) => {
  return res.send("Logout get");
};

exports.create_user_get = (req, res, next) => {
  return res.send("Create user get");
};

exports.create_user_post = async function(req, res, next) {
  try {
    bcrypt.hash(req.body.password, 10, async function(err, hashedpassword) {
      if (err) {
        return next(err);
      }
      const newuser = new User({
        email: req.body.email,
        password: hashedpassword,
        author_name: req.body.name,
      });
      try {
        // tested with curl -X POST -H "Content-Type:application/json" http://localhost.localdomain:3000/editor/createuser -d '{"email": "teste", "password": "password", "name": "nome"}'
        await newuser.save();
        return res.send(`${newuser}\n`);
      } catch (err) {
        return next(err);
      }
    });
  } catch (err) {
    return next(err);
  }
};

exports.update_post = (req, res, next) => {
  return res.send("Update post");
};

exports.delete_post = (req, res, next) => {
  return res.send("Delete post");
};

exports.delete_comment = (req, res, next) => {
  return res.send("Delete comment");
};
