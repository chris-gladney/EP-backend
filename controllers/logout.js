const nonGoogleUserdb = require("../model/nonGoogleUserSchema");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;
  const userWithRefreshToken = await nonGoogleUserdb.find({
    refreshToken: refreshToken,
  });

  if (!userWithRefreshToken) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  await nonGoogleUserdb.findOneAndUpdate(
    { user: userWithRefreshToken.user },
    { refreshToken: "" }
  );

  res.clearCookie("jwt", { httpOnly: true }); //Add secure: true in prod
  res.sendStatus(204);
};

module.exports = handleLogout;
