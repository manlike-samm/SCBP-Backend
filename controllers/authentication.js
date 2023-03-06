const jwt = require("jwt-simple");
const User = require("../models/User");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env, SECRET);
}

exports.signin = function (req, res) {
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(422)
      .send({ error: "Username and password must be provided" });
  }

  User.findOne({ username: username }, function (err, existingUser) {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).send({ error: "Username is already in use..." });
    }

    const user = new User({
      username: username,
      password: password,
    });

    user.save(function (err) {
      if (err) {
        return next(err);
      }
      res.json({ token: tokenForUser(user) });
    });
  });
};
