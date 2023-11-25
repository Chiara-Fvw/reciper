CREATE TABLE users (
  username text PRIMARY KEY,
  password text NOT NULL
);

CREATE TABLE categories (
  id serial PRIMARY KEY,
  category text UNIQUE NOT NULL,
  username text NOT NULL
);

CREATE TABLE recipes (
  id serial PRIMARY KEY,
  recipe text NOT NULL,
  prep_time integer NOT NULL,
  serves integer NOT NULL,
  ingredients text NOT NULL,
  steps text NOT NULL,
  username text NOT NULL,
  category_id integer
    NOT NULL
    REFERENCES categories(id)
    ON DELETE CASCADE
);