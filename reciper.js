const express = require("express");
const morgan = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const store = require("connect-loki");
const { body, validationResult } = require("express-validator");
const PgPersistence = require("./lib/pg-persistence");
const catchError = require("./lib/catch-error.js");

const app = express();
const LokiStore = store(session);
const host = "localhost";
const port = 3000;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));
app.use(morgan("common"));
app.use(session({ //a session is a way to store information about a user across multiple requests.
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000,
    path: "/",
    secure: false,
  },
  name: "reciper-sessionId",
  resave: false,
  saveUninitialized: true,
  secret: "Th1s 1s n0t s4fe 4t 4ll",
  store: new LokiStore({}),
}));

app.use(flash());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.store = new PgPersistence(req.session);
  next();
});

//Extract session info and store it on res.locals. We also store flash messages although is an exception because to pass data to views is better use app.locals.
app.use((req, res, next) => {
  res.locals.username = req.session.username;
  res.locals.signedIn = req.session.signedIn;
  res.locals.flash = req.session.flash;
  delete req.session.flash; //Delete after saving otherwise the message won't never go away.
  next();
});

const requiresAuthentication = (req, res, next) => {
  if (!res.locals.signedIn) {
    res.redirect(302, "/users/signin");
  } else {
    next();
  };
}

//Prueba route
app.get("/", (req, res) => {
  res.render("layout");
});

// Display Welcome page: The name and button signin

// Display the Home page: user's recipe book displaying categories

// Clic on a category and open the category page that shows all the recipes for that category

//Open add forms:
  // For category
  // For recipe

//Open edit form:
  // For category
  // For recipe

// Category Settings:
  // Create a new category
  // Edit a category
  // Delete a category

//Recipe settings:
  // Create a recipe
  // Edit a recipe
  // Delete a recipe

app.use((err, req, res, _next) => {
  console.log(err);
  res.status(404).send(err.message);
});

app.listen(port, host, () => {
  console.log(`Listening on port ${port} of ${host}.`)
});