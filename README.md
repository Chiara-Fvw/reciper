1. # PROJECT NAME AND DESCRIPTION:
  Reciper is a collection of organized recipes classified into categories.

  Categories and recipes can be added, edited and deleted.
  All the data will be displayed by its name's alphabetical order.
  In order to view any data or make any action, the user must be authenticated.
 

2. # INSTALLATION:
  Execute `npm install` on your CLI to install the necessary modules.

3. # CONFIGURATION:
  Run the following commands:
    `npm run createDb` :  creates the database
    `npm run createSchema` : creates the schema
    `npm run insertData`: populates the tables with the seed data.
    `npm run insertUsers`: uploads the users data.

  NODE VERSION:
    16.17.1
  BROWSER USED - VERSION: 
    Chrome - 119.0.6045.159 
  POSTGRESQL VERSION:
    14.7

4. # RUN THE APPLICATION:
  Initiate the application with the `npm start`command. 
  
  The app runs on port 3000 of your localhost.
  The user that has seed data is:
    Admin: admin / secret


5. # COMMENTS:

**Database and Sessions:**
The application utilizes a PostgreSQL database for storing data and express-session for user-specific information persistence. User-provided data is validated and sanitized using express-validator. Flash messages supported by express-flash notify the user any error he made. For other errors, users are redirected to a dedicated error page, which informs them of the issue and provides the option to return to the application home.

**Pagination:**
Categories and recipes are paginated. A common `getPaginationResult` method provides pagination data, and dedicated methods (`getPaginatedCategories` and `getPaginatedRecipes`) retrieve data using `LIMIT` and `OFFSET` in the respective queries. If a user manually inputs a non-numeric page number, it defaults to `1`. Incorrect page numbers trigger a flash message for the user.

**Recipe and Category Management:**
Authenticated users can view, create, edit, and delete recipes and categories. As recipes must have a category, a new recipe can be created only if the user has at least one category. That is why in the home view the `add a recipe` button only appears if the user has at lease one category. Furthermore, to force this table relation, the recipe's category can only be selected fromn a drop-down list that include all the created categories. 

When editing a recipe or dealing with errors while creating one, the data the user already entered is shown. This helps users avoid re-entering valid information and lets them spot mistakes in invalid data. The recipe's category is also preselected by default during these actions.

To make this process smoother, there is a helper function called `isSelected` that automatically picks the right category. This ensures a better overall experience for users in the system.

When a category is deleted all the related recipes are deleted too through the 'ON DELETE CASCADE' clause.
Before deleting a category or a recipe, a confirmation is required.

**Validation and sanitation**
If the user insert an unhandled url, will be redirected to the home page.
Route parameters are validated, and incorrect entries lead to error pages. Flash messages notify users of unavailable paginated result pages. Input validation and sanitation prevent injections in displayed text.

**Recipe Title Uniqueness:**
The recipes table lacks a UNIQUE constraint on the title column allowing modifications on its parts without altering the recipe name. However, as duplicated recipe title can lead to confusion, only for a recipe creation is not allowed to use an already existing recipe name.

**About queries**:
I opted for using LIMIT/OFFSET for pagination because I expect the recipe database not to have an excessively large number of recipes. This approach should be fast enough for its intended purpose.

When rendering the category view, which includes all the recipes for that category, I need to retrieve the category title, the total count of results and the paginated recipes. I could have used a single query that joins tables and counts the total results, like the following:

`SELECT recipes.*, COUNT(*) OVER () AS total_count, category
  FROM recipes
  JOIN categories ON category_id = categories.id
  WHERE category_id = $1 AND recipes.username = $2
  ORDER BY LOWER(recipe)
  LIMIT $3 OFFSET $4`

In my design, using a single query with joins and counting wouldn't have allowed me to achieve the specific data structure I envisioned. Here's why:

- If a category is not available, I want to throw an error. This ensures that the system communicates the issue clearly to the user.
- When the user manually chooses a page for pagination and sets an invalid page number, I prefer to handle this scenario differently. Instead of throwing an error, I want to display a friendly flash message, maintaining a smooth user experience.
- Additionally, I considered cases where a category exists but doesn't have any recipes yet. In such situations, my goal is to still render the page, displaying the category title, and offering the user the option to create a recipe.