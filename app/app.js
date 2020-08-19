const express = require("express");
const bodyp = require("body-parser");
const app = express();
const config = require("../config");
const addref = require("../models/addref");
const profile = require("../models/profile");
const passport = require("passport");
const session = require("express-session");
const SteamStrategy = require("./auth/index");

var bonusbalace;

var idsteam;

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:3000/auth/steam/return",
      realm: "http://localhost:3000/",
      apiKey: "80953B1B8F6EADCFDF1F1CB6547D333B",
    },
    function (identifier, profile, done) {
      process.nextTick(function () {
        profile.identifier = identifier;
        return done(null, profile);
      });
    }
  )
);

app.use("*/js", express.static("public/js"));
app.use("*/css", express.static("public/css"));
app.use("*/images", express.static("public/images"));
app.set("view engine", "ejs");
app.use(bodyp.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your secret",
    name: "name of session id",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/account", ensureAuthenticated, function (req, res) {
  var resss;
  profile.findOne({ SteamID: req.user.id }, function (err, docs) {
    if (err) return console.log(err);
    if (docs.length == 0) {
      console.log("fdf");
    } else {
      resss = docs;
    }
  });
  console.log(resss);
  res.render("account", {
    user: req.user,
    bonusbalance: bonusbalace,
    steam: resss,
  });
});
// promocode page
app.get("/promocode", (req, res) => {
  if (log == 1) {
    res.render("promocode", {
      user: req.user,
      bonusbalance: bonusbalace,
      steam: profile.find({ SteamID: req.user.id }),
    });
  } else {
    res.redirect("/");
  }
});
app.post("/promocode", (req, res) => {
  console.log(req.user.id);
  const { code } = req.body;
  const { freecode } = req.body;
  //enter promocode
  addref.find({ code: freecode }, function (err, docs) {
    if (err) return console.log(err);
    if (docs.length == 0) {
      console.log("fefe");
    } else {
      profile.findOne({ SteamID: req.user.id }, function (err, fobj) {
        if (err) {
          console.log(err);
          res.status(500).send();
        } else {
          if (!fobj) {
            console.log("nope");
            res.status(404).send();
          } else {
            fobj.bonusbalance = bonusbalace + 10;
            bonusbalace = fobj.bonusbalance;
            console.log(bonusbalace);
            fobj.save(function (err) {
              if (err) {
                res.status(500).send();
              } else {
                //ne radotaet
              }
            });
          }
        }
      });
    }
  });

  const id = req.user.id;

  addref.find({ id: req.user.id }, function (err, docs) {
    if (err) return console.log(err);
    if (docs.length == 0) {
      addref
        .create({
          code: code,
          id: id,
        })
        .then((post) => console.log(post._id));
      profile.findOne({ SteamID: req.user.id }, function (err, fobj) {
        if (err) {
          console.log(err);
          res.status(500).send();
        } else {
          if (!fobj) {
            console.log("nope");
            res.status(404).send();
          } else {
            fobj.bonusbalance = bonusbalace + 10;
            bonusbalace = fobj.bonusbalance;
            console.log(fobj.bonusbalance);

            fobj.save(function (err) {
              if (err) {
                res.status(500).send();
              } else {
                //!!!!!!!!!!!!!!!!!!!!!!!1
                res.redirect("/promocode");
              }
            });
          }
        }
      });
    } else {
      console.log(docs);
      res.redirect("/promocode");
    }
  });
});
app.get(
  "/auth/steam",
  passport.authenticate("steam", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/");
  }
);
var log = 0;
app.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  function (req, res) {
    log = 1;
    console.log(log);
    res.redirect("/promocode");
    idsteam = req.user.id;
    var steamid = req.user.id;
    var name = req.user.displayName;
    var avatar = req.user.photos[2].value;
    profile.find({ SteamID: req.user.id }, function (err, docs) {
      if (err) return console.log(err);
      if (docs.length == 0) {
        profile.create({
          SteamID: steamid,
          actbalance: 0,
          bonusbalance: 10,
          allreaderef: false,
          name: name,
          avatar: avatar,
        });
        bonusbalace = 10;
        console.log(bonusbalace);
      } else {
        console.log(docs);
      }
    });
  }
);

app.get("/", (req, res) => {
  res.render("index", {
    user: req.user,
    bonusbalance: bonusbalace,
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = app;
