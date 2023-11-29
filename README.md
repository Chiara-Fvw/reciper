PROJECT NAME AND DESCRIPTION:
  The Reciper is an application used to store recipes within categories. 

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
  The user with seed data credentials are:
    User1: admin / secret




*How to install, configure, and run the application.
*Any additional details the grader may need to run your code.
*Keep in mind that your grader may be unfamiliar with the problem domain. If you think that's a possibility, you may wish to add a brief discussion of the vocabulary and concepts used in the application.

Provide a README.md file with your project that describes any details of your project that you think the grader will need to understand how it works and how to use it. 

You can also use this file to talk about any design choices or trade-offs you made. 



******

In the Reciper, the recipes table will not have the `UNIQUE` constraint, in this way the user will be able to edit the content of the recipe without changing the recipe name. However, the user won't be able to create a recipe if the name already exists, in an apptempt to avoid recipe duplication.

Total count to save on queries when paginating results

Before:

"npm run createDb" : will create the database
"npm run createSchema" : will create the schema
"npm run insertData": will populate the tables with the seed data.
