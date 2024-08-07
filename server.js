require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const PORT = 5000;
const FEPORT = 5173;

require("./db/connection");

const session = require("express-session");
const passport = require("passport");

const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const LocalStrategy = require("passport-local").Strategy;

const userdb = require("./model/userSchema");
const nonGoogleUserdb = require("./model/nonGoogleUserSchema");
const admindb = require("./model/adminSchema");

const verifyJWT = require("./middleware/verifyJWT");
const adminRegister = require("./controllers/adminRegister");
const userRegister = require("./controllers/userRegister");

app.use(
  cors({
    origin: `http://localhost:${FEPORT}`,
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.post("/admin/register", async (req, res) => {
  adminRegister(req, res);
});

app.post("/register", async (req, res) => {
  userRegister(req, res);
});

// -----------------------------------------------------------------------------
// Google login begins

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await userdb.findOne({ googleId: profile.id });

        if (!user) {
          user = new userdb({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            userEvents: [],
          });

          await user.save();
        }

        return done(null, user);
      } catch {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `http://localhost:${FEPORT}/events`,
    failureRedirect: `http://localhost:${FEPORT}/login`,
  })
);

app.get("/login/success", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "user login", user: req.user });
  } else {
    res.send(400).json({ message: "Not Authorised" });
  }
});

// Google login ends
// --------------------------------------------------------------------

// Passport local strategy - trialing jwt tokens
//---------------------------------------------------------------------

// passport.use(
//   "local",
//   new LocalStrategy(
//     {
//       usernameField: "user",
//       passwordField: "pwd",
//       passReqToCallback: true,
//     },
//     async (req, user, pwd, done) => {
//       let userLogin = await nonGoogleUserdb.findOne({ user: user });
//       try {
//         if (!user) {
//           return done(null, false);
//         }

//         if (pwd !== userLogin.pwd) {
//           return done(null, false);
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// app.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//   }),
//   function (req, res) {
//     res
//       .status(200)
//       .send({ message: "Accessed route and verified", user: req.body.user });
//   }
// );

// ---------------------------------------------------------------
// Passport local strategy

app.post("/login", async function (req, res) {
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
      accessToken: jwt.sign(
        { username: foundUser.user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "600s" }
      ),
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log(`server started at port: ${PORT}`);
});
