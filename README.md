1. # PROJECT NAME AND DESCRIPTION:
  Reciper is just a collection of recipes that are organized within categories.

  Categories and recipes can be added, edited and deleted.
  All the data will be displayed by its name's alphabetical order.
  In order to view any data or make any action, the user must be authenticated.
 

2. # INSTALLATION:
  Run `npm install` on your cli to install modules.

3. # CONFIGURATION:
  Run the following commands for:
    `npm run createDb` : will create the database
    `npm run createSchema` : will create the schema
    `npm run insertData`: will populate the tables with the seed data.
    `npm run insertUsers`: will upload the users data.

  NODE VERSION:
    16.17.1
  BROWSER USED - VERSION: 
    Safari - 17.1
    Chrome - 119.0.6045.159 
  POSTGRESQL VERSION:
    14.7

4. # RUN THE APPLICATION:
  To start the application use the `npm start`command.
  
  The app will run on port 3000 of your localhost.
  The user that has seed data is:
    Admin: admin / secret


5. # COMMENTS:

**Database and Sessions:**
The application utilizes a PostgreSQL database to store application data and express-session for persisting user-specific information. express-validator is employed to validate and sanitize user-provided data. In the case of user errors, flash messages supported by express-flash notify the user. For database or incorrect URL errors, users are redirected to a dedicated error page, which informs them of the issue and provides the option to return to the application home.

**Pagination:**
The application lists categories and recipes with pagination. A common `getPaginationResult` method provides pagination data, and dedicated methods (`getPaginatedCategories` and `getPaginatedRecipes`) retrieve data using `LIMIT` and `OFFSET` in the respective queries. If a user manually inputs a non-numeric page number, it defaults to `1`. Incorrect page numbers trigger a flash message for the user.

**Recipe Category Management:**
Users can display, create, modify, and delete recipes and categories but must be authenticated. To empower users to modify a recipe's category, a select input is used. This ensures users can only choose from pre-existing categories. If a user has no categories, the "add a recipe" button won't display. Editing a recipe or encountering validation errors during recipe creation preselects the recipe's category by default. A view helper, `isSelected`, assists in automatically selecting the appropriate category, enhancing the user experience.

**Recipe Title Uniqueness:**
The recipes table lacks a UNIQUE constraint on the title column, allowing modifications without altering the recipe name. To prevent confusion, the recipe creation middleware checks for an existing recipe with the same name before creating it.

**About queries**:
I opted for using LIMIT/OFFSET for pagination because I expect the recipe database not to have an excessively large number of recipes. This approach should be fast enough for its intended purpose.

When rendering the category view, which includes all the recipes for that category, I need to retrieve the category title, the total count of results and the paginated recipes. I could have used a single query that joins tables and counts the total results, like the following:

`SELECT recipes.*, COUNT(*) OVER () AS total_count, category
  FROM recipes
  JOIN categories ON category_id = categories.id
  WHERE category_id = $1 AND recipes.username = $2
  ORDER BY LOWER(recipe)
  LIMIT $3 OFFSET $4`

However, this approach would not have allowed me to follow the data structure I had in mind. Specifically, if the category is not available, I want to throw an error. On the other hand, it's possible that a category exists but doesn't have any recipes yet. In this case, I still want to render the page and give the user the option to create a recipe.