PROJECT NAME AND DESCRIPTION:
  Reciper is just a collection of recipes that are organized within categories.

  Categories and recipes can be added, edited and deleted.
  All the data will be displayed by its name's alphabetical order.
  In order to view any data or make any action, the user must be authenticated.
 

INSTALLATION:
  Run `npm install` on your cli to install modules.

CONFIGURATION:
  Run the following command for:
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

USAGE:
  To start the application use the `npm start`command.
  
  The app will run on port 3000 of your localhost.
  The user that has seed data is:
    Admin: admin / secret


******

COMMENTS:
- I aimed to empower users with the ability to modify a recipe's category. Since recipes are inherently tied to categories (each recipe must belong to a category, and the category must already exist), I decided to employ a select input. This approach ensures that users can only choose a category from the pre-existing ones.
In the context of editing a recipe or encountering validation errors during recipe creation, I wanted the recipe's category to be preselected by default. To implement this, I introduced a view helper called `isSelected`, specifically designed for use in the `recipe-new` and `recipe-edit` views. This helper assists in automatically selecting the appropriate category, enhancing the user experience when interacting with the recipe management system.

- The database table for recipes does not have an `UNIQUE` constraint on its title column so the recipe details can be modified without having to alter the recipe name. However, as having two recipes with the same name could bring some confusion, the recipe creation middleware will check if already exists a recipe with that name before creating it.

______________________________________-

General Requirements


Unlike the LS App, your project should validate the page number and issue an appropriate error message if the URL is given with an invalid page number.


Validate or sanitize all input data as needed, including data passed in the URL. In particular, you must prevent SQL and JavaScript injection.

Do not rely exclusively on HTML validation or JavaScript validation that executes in the browser - both of those can be easily circumvented by users.

If an input error is detected, the page should be redisplayed with an appropriate flash message.

Other Requirements and Guidelines

Provide a README.md file with your project that describes any details of your project that you think the grader will need to understand how it works and how to use it. 

You can also use this file to talk about any design choices or trade-offs you made. At a minimum, the README.md file should mention the following information:


Use your judgment for specifications that we haven't mentioned explicitly. Your assumptions should not conflict with the explicit requirements. Please note your assumptions and decisions in the README.md file.

ASSUMPTIONS:

The application will use a postgre database to store the application data and express-session in order to persist user-specific data. Express-validator will be used to validate and sanitize user provided data.
If a user make some error, it will be noticed through flash messages supported by express-flash. If the error is from database or incorrect url, the user will be redirected to an error dedicated page that will inform that an error has occurred and gives the user the possibility to go back to the home.

As the application will be listing categories and recipes, both will be displayed with pagination, to this purpose there is a common `getPaginationResult` method that will provide the data for the pagination commands and a dedicated method (`getPaginatedCategories` and `getPaginatedRecipes`) to retrieve the data by using `LIMIT` AND `OFFSET` in the respective queries.


