PROJECT NAME AND DESCRIPTION:
  The Reciper is an application used to store recipes within categories. 

INSTALLATION:
  Install all modules by running `npm install`on your cli.

  NODE VERSION: 
    16.17.1
  BROWSER USED - VERSION: 
    Safari - 17.1
    Chrome - 119.0.6045.159 
  POSTGRESQL VERSION:
    14.7

CONFIGURATION:
  Create a database named reciper and import the schema.sql file to it.
  Insert the seed data by importing the lib/seed-data.sql file.
  Although sharing the user login data is an unsecure practice, I am providing a user-data.sql file for examination purposes.

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