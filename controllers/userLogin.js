const nonGoogleUserdb = require("../model/nonGoogleUserSchema");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const userLogin = async (req, res) => {
  try {
    const { user, pwd } = req.body;

    if (!user || !pwd)
      return res
        .status(400)
        .json({ message: "Username and password are required." });

    const foundUser = await nonGoogleUserdb.findOne({ user: user });
    if (!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(pwd, foundUser.pwd);
    if (match) {
      const accessToken = jwt.sign(
        { username: foundUser.user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "600s" }
      );

      const refreshToken = jwt.sign(
        { username: foundUser.user },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
    }
    res.cookie(
      "jwt",
      jwt.sign({ username: foundUser.user }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
      }),
      {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      }
    );
    res.json({
      user: foundUser.user,
      accessToken: jwt.sign(
        { username: foundUser.user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "600s" }
      ),
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = userLogin;
