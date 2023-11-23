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
    const GET_CATEGORIES = "SELECT * FROM categories WHERE username = $1 ORDER BY category";
    let result = await dbQuery(GET_CATEGORIES, this.username);
    return result.rows;
  };

  async getRecipes(catId) {
    const RECIPES_BY_CATEGORY = "SELECT * FROM recipes WHERE category_id = $1 and username = $2 ORDER BY recipe";
    let result = await dbQuery(RECIPES_BY_CATEGORY, catId, this.username);
    return result.rows;
  };

  async getCategoryTitle(id) {
    const CATEGORY_TITLE = "SELECT category FROM categories WHERE id = $1 and username = $2";
    let result = await dbQuery(CATEGORY_TITLE, id, this.username);
    return result.rows[0].category;
  }

};