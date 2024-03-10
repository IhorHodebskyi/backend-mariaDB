const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db/connection");

const { SECRET_KEY } = process.env;

const getAllUser = (req, res) => {
  db.query(
    "SELECT `id`, `name`, `email`  FROM `users`",
    (error, rows, fields) => {
      if (error) {
        res.status(400).json({ error });
      } else {
        res.status(200).json({ rows });
      }
    }
  );
};

const signUp = (req, res) => {
  const { name, email } = req.body;
  db.query(
    "SELECT `id`, `email`, `name` FROM `users` WHERE `email` = '" + email + "'",
    (error, rows, fields) => {
      if (error) {
        res.status(400).json({ error });
      }
      if (typeof rows !== "undefined" && rows.length > 0) {
        res.status(409).json({ message: "Email in use" });
      } else {
        const salt = bcrypt.genSaltSync(15);
        const password = bcrypt.hashSync(req.body.password, salt);
        const token = jwt.sign({ data: "foobar" }, SECRET_KEY, {
          expiresIn: "23h",
        });
        const sql =
          "INSERT INTO `users` (`name`, `email`, `password`, `token`) VALUES ('" +
          name +
          "', '" +
          email +
          "','" +
          password +
          "', '" +
          token +
          "')";
        db.query(sql, (error) => {
          if (error) {
            res.status(400).json({ error });
          } else {
            res.status(200).json({ token, user: { name, email } });
          }
        });
      }
    }
  );
};

module.exports = {
  getAllUser,
  signUp,
};
