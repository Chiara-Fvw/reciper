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
    const GET_CATEGORIES = "SELECT * FROM categories WHERE username = $1 "
                        + "ORDER BY LOWER(category) ASC";
    let result = await dbQuery(GET_CATEGORIES, this.username);
    return result.rows;
  };

  async getPaginatedCategories(limit, offset) {
    const CATEGORIES = "SELECT * FROM categories WHERE username = $1 " 
                    + "ORDER BY LOWER(category) LIMIT $2 OFFSET $3";
    let result  = await dbQuery(CATEGORIES, this.username, limit, offset);
    return result.rows;
  };

  async getPaginatedRecipes(catId, limit, offset) {
    const RECIPES_BY_CATEGORY = "SELECT * FROM recipes "
                    + "WHERE category_id = $1 AND username = $2 " 
                    + "ORDER BY LOWER(recipe) ASC LIMIT $3 OFFSET $4";
    let result = await dbQuery(RECIPES_BY_CATEGORY, catId, this.username, limit, offset);
    return result.rows;
  };

  async getCategoryTitle(id) {
    const CATEGORY_TITLE = "SELECT category FROM categories " 
                    +"WHERE id = $1 and username = $2";
    let result = await dbQuery(CATEGORY_TITLE, id, this.username);
    if (result.rowCount < 1 ) return undefined;
    return result.rows[0].category;
  };

  async getRecipe(id) {
    const RECIPE = "SELECT recipes.*, categories.category FROM recipes "
                + "INNER JOIN categories ON recipes.category_id = categories.id " 
                + "WHERE recipes.id = $1 AND recipes.username = $2";
    let result = await dbQuery(RECIPE, id, this.username);
    return result.rows[0];
  };

  async existsCategory(title) {
    const EXISTS_TITLE = "SELECT category FROM categories " 
                + "WHERE category = $1 AND username = $2";
    let result = await dbQuery(EXISTS_TITLE, title, this.username);
    return result.rowCount > 0;
  };
  
  async addCategory(title) {
    const NEW_CATEGORY = "INSERT INTO categories (category, username) VALUES ($1, $2)";
    let result = await dbQuery(NEW_CATEGORY, title, this.username);
    return result.rowCount > 0;
  };

  async existsRecipe(title) {
    const EXISTS_TITLE = "SELECT recipe FROM recipes WHERE recipe = $1 AND username = $2";
    let result = await dbQuery(EXISTS_TITLE, title, this.username);
    return result.rowCount > 0;
  };

  async addRecipe(...values) {
    const NEW_RECIPE = "INSERT INTO recipes "
      + "(recipe, category_id, serves, prep_time, ingredients, steps, username)" 
      + "VALUES ($1, $2, $3, $4, $5, $6, $7)";
    values.push(this.username);
    let result = await dbQuery(NEW_RECIPE, ...values);
    return result.rowCount > 0;
  };

  async editCategory(title, id) {
    const UPDATE_CATEGORY = "UPDATE categories SET category = $1 "
                  + "WHERE id = $2 AND username=$3";
    let result = await dbQuery(UPDATE_CATEGORY, title, id, this.username);
    return result.rowCount > 0;
  };

  async deleteCategory(id) {
    const DELETE_CATEGORY = "DELETE FROM categories WHERE id = $1 AND username = $2";
    let result = await dbQuery(DELETE_CATEGORY, id, this.username);
    return result.rowCount > 0;
  };

  async editRecipe(...values) {
    const EDIT_RECIPE = "UPDATE recipes SET " 
          + "recipe = $1, category_id = $2, serves = $3, " 
          + "prep_time = $4, ingredients = $5, steps = $6 " 
          + "WHERE id = $7 AND username = $8";
    values.push(this.username);
    let result = await dbQuery(EDIT_RECIPE, ...values);
    return result.rowCount > 0;
  };

  async deleteRecipe(id) {
    const DELETE_RECIPE = "DELETE FROM recipes WHERE id = $1 AND username = $2";
    let result = await dbQuery(DELETE_RECIPE, id, this.username);
    return result.rowCount > 0; 
  };
  
  getPaginationResult(totalCount, page, limit) {
    const totalPages = Math.ceil(totalCount / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;
    const allPages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return {
      currentPage: page,
      totalPages,
      nextPage,
      prevPage,
      allPages,
    };
  };

  async categoriesCount() {
    const COUNT = "SELECT COUNT(*) FROM categories WHERE username = $1";
    let result = await dbQuery(COUNT, this.username);
    return result.rows[0].count;
  };

  async recipesCount(id) {
    const COUNT = "SELECT COUNT(*) FROM recipes WHERE category_id = $1 AND username = $2";
    let result = await dbQuery(COUNT, id, this.username);
    return result.rows[0].count;
  };
};
