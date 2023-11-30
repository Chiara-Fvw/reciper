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

