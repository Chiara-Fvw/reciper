INSERT INTO categories (title, username)
VALUES ('Foreign recipes', 'admin'),
       ('Breakfast', 'admin');

INSERT INTO recipes (title, prep_time, serves, ingredients, steps, username, category_id)
VALUES ('Tortilla de Patatas', 60, 6, '6 eggs, 300gr of potatoes, 1 onion, oil, salt', 'In a pan fry the onion and the potatoes. When ready, mix the eggs in a bowl and add the onion and potatoes discarting the oil in excess. When all is mixed pour again in the hot pan and cook few minutes in low hit. When almost all the egg has set. When ready, use a dish to flip the tortilla and cook few more minutes. Use the dish to take out the tortilla and ENJOY IT!', 'admin', 1),
('Pasta Carbonara', 15, 4, '4 eggs yolks, 320gr spaghetti, 150gr minced bacon, 80gr parmesan cheese, salt, pepper', 'Put water to boil. Meanwhile cook the bacon in a pan. When water boils, add salt and spaghetti and cook for the indicated time. Meanwhile mix the egg and 1 tbsp of parmesan cheese together in a bowl. When pasta is ready, add to the bowl together with the bacon and stir properly. Before serving, spread the remaining chees and pepper.', 'admin', 1),
('Avocado toast', 8, 2, '2 eggs, 2 slices of favorite bread, 1 avocado, salt, pepper, seeds', 'Poach the eggs. Toast the bread. Spread the avocado on the toasts. Add the poached egg. Season with salt, pepper and seeds.', 'admin', 2);