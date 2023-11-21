const { Client } = require("pg"); //importing the Client function of the pg module

//this logs the query to help debugging
const logQuery = (statement, parameters) => {
  let timeStamp = new Date();
  let formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

module.exports = {
  async dbQuery(statement, ...parameters) {
    let client = new Client({ database: "reciper" });

    await client.connect();
    logQuery(statement, parameters);
    let result = await client.query(statement, parameters);
    await client.end(); //Disconnect the client from the PostgreSQL server.

    return result;
  }
};

//If you need to make multiple queries to the database during the program’s operation, you need to either ~keep the connection open~, **or** if it has already been closed, ~instantiate a new client object~ to connect with.