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




*How to install, configure, and run the application.
*Any additional details the grader may need to run your code.
*Keep in mind that your grader may be unfamiliar with the problem domain. If you think that's a possibility, you may wish to add a brief discussion of the vocabulary and concepts used in the application.

Provide a README.md file with your project that describes any details of your project that you think the grader will need to understand how it works and how to use it. 

You can also use this file to talk about any design choices or trade-offs you made. 



******

COMMENTS:

There are some decisions I made that I would like to explain:
- The database table for recipes does not have an `UNIQUE` constraint on its title column. 
This is made on purpose so the recipe details can be modified without having to alter the recipe name. However, as having two recipes with the same name could bring some confusion, the recipe creation middleware will check if already exists a recipe with that name before creating it.


