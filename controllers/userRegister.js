const nonGoogleUserdb = require("../model/nonGoogleUserSchema");
const bcrypt = require("bcrypt");

const userRegister = async (req, res) => {
  try {
    let user = await nonGoogleUserdb.findOne({ user: req.body.user });

    if (!user) {
      const hashedPwd = await bcrypt.hash(req.body.pwd, 10);

      newUser = new nonGoogleUserdb({
        user: req.body.user,
        pwd: hashedPwd,
        userEvents: [],
        accessToken: "",
        refreshToken: "",
        role: 2001,
      });

      await newUser.save();
      res.status(201).send({ message: "Successfully Signed Up" });
    } else if (user) {
      res.status(409).send({ message: "Username Taken", error: "409" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = userRegister;
