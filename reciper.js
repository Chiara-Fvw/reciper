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

//Middleware to test if the user have permission to access specific functionalities and views.
const requiresAuthentication = (req, res, next) => {
  if (!res.locals.signedIn) {
    res.redirect(302, "/user/signin");
  } else {
    next();
  };
}

// Display Welcome page: The app's name and button signin
app.get("/", (req, res) => {
  res.render("welcome");
});

//Display sign-in form:
app.get("/user/signin", (req, res) => {
  res.render("signin");
})

// Display the Home page: user's recipe book displaying categories (pagination)
app.get("/home", 
  requiresAuthentication,
  catchError(async (req, res) => {
    const PAGE = parseInt(req.query.page) || 1;
    const LIMIT = 5;
    const OFFSET = (PAGE - 1) * LIMIT;

    let count = await res.locals.store.categoriesCount();
    if (count === '0') {
      res.render("home");
    } else {
      let pagination = await res.locals.store.getPaginationResult(count, PAGE, LIMIT);
      if (PAGE > pagination.totalPages) throw new Error("Not found.")
      
      let categories = await res.locals.store.getPaginatedCategories(LIMIT, OFFSET);
      if(!categories) throw new Error("Not found.");
      
      res.render("home", {
        categories,
        pagination
      });
    };
  })
);

// Open the category page that shows all the recipes of that category (with pagination)
app.get("/category/:id", requiresAuthentication, 
  catchError(async(req, res) => {
    const PAGE = parseInt(req.query.page) || 1;
    const LIMIT = 2;
    const OFFSET = (PAGE - 1) * LIMIT;

    let categoryId = req.params.id;
    let categoryTitle = await res.locals.store.getCategoryTitle(+categoryId);
    if(!categoryTitle) throw new Error("Not found.");
    let count = await res.locals.store.recipesCount(categoryId);
    if (count === '0') {
      res.render("category", {
        categoryTitle,
        categoryId
      });
    } else {
      let pagination = await res.locals.store.getPaginationResult(count, PAGE, LIMIT);
      if (PAGE > pagination.totalPages)  throw new Error("Not found.")
      let recipes = await res.locals.store.getPaginatedRecipes(+categoryId, LIMIT, OFFSET);
      res.render("category", {
        recipes,
        categoryTitle,
        categoryId,
        pagination
      });
    };
  })
);

//Display the recipe view
app.get("/recipe/:category/:id", requiresAuthentication,
  catchError(async(req, res) => {
    let id = req.params.id;
    let category = req.params.category;

    let categoryTitle = await res.locals.store.getCategoryTitle(+category);
    if(!categoryTitle) throw new Error("Not found.");

    let recipeInfo = await res.locals.store.getRecipe(+id);
    if(!recipeInfo) throw new Error("Not found.");
    res.render("recipe", {
      recipeInfo,
      categoryTitle
    });
  })
);

//Open add forms:
  // For category
app.get("/categories/new", requiresAuthentication, (req, res) => {
  res.render("category-new");
});

  // For recipe
app.get("/recipes/new", requiresAuthentication, 
  catchError(async(req, res) => {
    let categories = await res.locals.store.getCategories();
    if(!categories) throw new Error("No categories found.");
    res.render("recipe-new", {
      categories
    });
  })
);

//Open edit form:
  // For category
app.get("/categories/edit/:id", 
  requiresAuthentication,
  catchError(async(req, res) => {
    let id = req.params.id;
    let category = await res.locals.store.getCategoryTitle(+id);
    if(!category) throw new Error("Not found.");
    res.render("category-edit", {
      category,
      id,
      flash: req.flash()
    });
  }) 
);
  // For recipe
app.get("/recipes/edit/:id", requiresAuthentication, 
  catchError(async(req,res) => {
    let id = req.params.id;
    let recipe = await res.locals.store.getRecipe(+id);
    if (!recipe) throw new Error("Not found.");
    let categories = await res.locals.store.getCategories();
    res.render("recipe-edit", {
      id,
      title: recipe.recipe,
      category: recipe.category_id,
      serves: recipe.serves,
      prep_time: recipe.prep_time,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      categories,
      flash: req.flash()
    });
  })
);

// Category Settings:
  // Create a new category
app.post("/categories/new", 
  requiresAuthentication, 
  [
    body("category")
      .trim()
      .isLength({ min: 1 })
      .withMessage("The category must have a title.")
  ],
  catchError(async(req, res) => {
    let errors = validationResult(req);
    let category = req.body.category;

    let rerenderCategory = () => {
      res.render("category-new", {
        category,
        flash: req.flash()
      });
    }

    if(!errors.isEmpty()) {
      req.flash("error", errors[0].msg);
      rerenderCategory();
    } else if (await res.locals.store.existsCategory(category)) {
      req.flash("error", "The category already exists.");
      rerenderCategory();
    } else {
      let created = await res.locals.store.addCategory(category);
      if(!created) throw new Error("Not found.");
      req.flash("success", "The new category has been added to your book.");
      res.redirect("/home");
    }
  })
);
  // Edit a category
app.post("/categories/edit/:id", 
  requiresAuthentication,
  [
    body("category")
      .trim()
      .isLength({ min: 1 })
      .withMessage("The category must have a title.")
  ],
  catchError(async(req, res) => {
    let errors = validationResult(req);
    let id = req.params.id;
    let category = req.body.category;

    let rerenderCategory = () => {
      res.render("category-edit", {
        id,
        category,
        flash: req.flash()
      });
    }

    if(!errors.isEmpty()) {
      req.flash("error", errors[0].msg);
      rerenderCategory();
    } else if (await res.locals.store.existsCategory(category)) {
      req.flash("error", "This category already exists.");
      rerenderCategory()
    } else {
      let updated = await res.locals.store.editCategory(category, id);
      if (!updated) throw new Error("Not found.");
      req.flash("success", "The category has been modified.");
      res.redirect(`/category/${id}`);
    }
  }) 
);
  // Delete a category
app.post("/categories/delete/:id", requiresAuthentication, catchError(async(req, res) => {
  let id = req.params.id;
  let deleted = await res.locals.store.deleteCategory(+id);
  if(!deleted) throw new Error("Not found.");
  req.flash("success", "The category has been deleted.");
  res.redirect(`/home`);
})
);

//Recipe settings:
  // Create a recipe
app.post("/recipes/new", 
  requiresAuthentication,
  [
    body("title")
      .trim()
      .isLength({ min:1 })
      .withMessage("Recipes must have a title."),
    body("serves")
      .isNumeric()
      .withMessage('Serves must be numeric')
      .custom(value => parseFloat(value) > 0)
      .withMessage("There must be at least one serve."),
    body("prep_time")
      .isNumeric()
      .withMessage('Preparation time must be set in number of minutes')
      .custom(value => parseFloat(value) > 0)
      .withMessage("Every preparation must take at least one minute."),
    body("ingredients")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Recipes must have ingredients."),
    body("steps")
      .trim()
      .isLength({ min:4 })
      .withMessage("Recipes need directions...")
  ], 
  catchError(async(req, res) => {
    let categories = await res.locals.store.getCategories();
    let { title, category, serves, prep_time, ingredients, steps } = req.body;
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      errors.array().forEach(message => req.flash("error", message.msg));
      res.render("recipe-new", {
        title,
        category,
        serves,
        prep_time,
        ingredients,
        steps,
        categories,
        flash: req.flash()
      });
    } else {
      let addedRecipe = await res.locals.store.addRecipe(title, category, serves, prep_time, ingredients, steps);
      if(!addedRecipe) throw new Error("Not found.");

      req.flash("success", "The new recipe has been added to your book!");
      res.redirect(`/category/${category}`);
    }
  })
);
  // Edit a recipe
app.post("/recipes/edit/:id", 
  requiresAuthentication,
  [
    body("title")
      .trim()
      .isLength({ min:1 })
      .withMessage("Recipes must have a title."),
    body("serves")
      .isNumeric()
      .withMessage('Serves must be numeric')
      .custom(value => parseFloat(value) > 0)
      .withMessage("There must be at least one serve."),
    body("prep_time")
      .isNumeric()
      .withMessage('Preparation time must be set in number of minutes')
      .custom(value => parseFloat(value) > 0)
      .withMessage("Every preparation must take at least one minute."),
    body("ingredients")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Recipes must have ingredients."),
    body("steps")
      .trim()
      .isLength({ min:4 })
      .withMessage("Recipes need directions...")
  ],
  catchError(async(req, res) => {
    let errors = validationResult(req);
    let id = req.params.id;
    let categories = await res.locals.store.getCategories();
    let { title, category, serves, prep_time, ingredients, steps } = req.body;
    if (!errors.isEmpty()) {
      errors.array().forEach(message => req.flash("error", message.msg));
      res.render("recipe-edit", {
        title,
        category,
        serves,
        prep_time,
        ingredients,
        steps,
        categories,
        flash: req.flash()
      })
    } else {
      let updated = await res.locals.store.editRecipe(title, +category, serves, prep_time, ingredients, steps, +id);
      if (!updated) throw new Error("Not found.");
      req.flash("success", "The recipe has been updated.");
      res.redirect(`/recipe/${category}/${id}`);
    };
  })
);
  // Delete a recipe
app.post("/recipes/delete/:id", requiresAuthentication, 
  catchError(async(req, res) => {
    let id = req.params.id;
    let deleted = await res.locals.store.deleteRecipe(+id);
    if(!deleted) throw new Error("Not found.");
    req.flash("success", "The recipe has been deleted.");
    res.redirect("/home");
  })
);

//Handle sign in
app.post("/user/signin", catchError(async(req, res) => {
  let username = req.body.username.trim();
  let password = req.body.password;

  let authenticated = await res.locals.store.authenticate(username, password);

  if (!authenticated) {
    req.flash("error", "Invalid credentials.");
    res.render("signin", {
      flash: req.flash(),
      username: req.body.username,
    });
  } else {
    req.session.username = username;
    req.session.signedIn = true;
    req.flash("info", `Welcome ${username}!`);
    res.redirect("/home");
  }
})
);

//Handle sing out
app.post("/user/signout", (req, res) => {
  delete req.session.username;
  delete req.session.signedIn;
  res.redirect("/");
});

//Error handler
app.use((err, req, res, _next) => {
  console.log(err);
  res.status(404).render("error", {error: err.message});
});

//Listener
app.listen(port, host, () => {
  console.log(`Listening on port ${port} of ${host}.`)
});