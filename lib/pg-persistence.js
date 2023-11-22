const { dbQuery } = require("./db-query");
const bcrypt = require("bcrypt");

module.exports = class PgPersistence {
  constructor(session) {
    this.username = session.username;
  };

  async authenticate(username, password) {
    const FIND_HASHED_PASSWORD = "SELECT password FROM users WHERE username = $1";

    let result = await dbQuery(FIND_HASHED_PASSWORD, username);
    if (result.rowCount === 0) return false;
    return bcrypt.compare(password, result.rows[0].password);
  };

  async getCategories() {
    const GET_CATEGORIES = "SELECT * FROM categories WHERE username = $1 ORDER BY title";
    let result = await dbQuery(GET_CATEGORIES, this.username);
    return result.rows;
  };

};