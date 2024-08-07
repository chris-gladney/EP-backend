const adminRegister = async (req, res) => {
  try {
    let admin = await admindb.findOne({ user: req.body.user });
    if (!admin) {
      newAdmin = new admindb({
        user: req.body.user,
        pwd: req.body.pwd,
      });

      await newAdmin.save();
      res.status(201).send({ message: "Admin Created" });
    } else if (admin) {
      res.status(409).send({ message: "Admin already exists" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = adminRegister;
