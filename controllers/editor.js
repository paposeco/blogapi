import User from "../models/user";
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.new_post_get = (req, res, next) => {
  return res.send("New blog post get");
};

exports.new_post_post = (req, res, next) => {
  return res.send("New blog post post");
};

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

        // need to then send a token to api or something

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
