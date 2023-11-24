INSERT INTO categories (category, username)
VALUES ('Foreign recipes', 'admin'),
       ('Breakfast', 'admin');

INSERT INTO recipes (recipe, prep_time, serves, ingredients, steps, username, category_id)
VALUES ('Tortilla de Patatas', 60, 6, '6 eggs, 300gr of potatoes, 1 onion, oil, salt', 'In a pan fry the onion and the potatoes. When ready, mix the eggs in a bowl and add the onion and potatoes discarting the oil in excess. When all is mixed pour again in the hot pan and cook few minutes in low hit. When almost all the egg has set. When ready, use a dish to flip the tortilla and cook few more minutes. Use the dish to take out the tortilla and ENJOY IT!', 'admin', 1),
('Pasta Carbonara', 15, 4, '4 eggs yolks, 320gr spaghetti, 150gr minced bacon, 80gr parmesan cheese, salt, pepper', 'Put water to boil. Meanwhile cook the bacon in a pan. When water boils, add salt and spaghetti and cook for the indicated time. Meanwhile mix the egg and 1 tbsp of parmesan cheese together in a bowl. When pasta is ready, add to the bowl together with the bacon and stir properly. Before serving, spread the remaining chees and pepper.', 'admin', 1),
('Avocado toast', 8, 2, '2 eggs, 2 slices of favorite bread, 1 avocado, salt, pepper, seeds', 'Poach the eggs. Toast the bread. Spread the avocado on the toasts. Add the poached egg. Season with salt, pepper and seeds.', 'admin', 2),
('Basic Muffin', 45, 5, '2 medium eggs, 125ml vegetable oil, 250ml semi-skimmed milk, 250g golden caster sugar, 400g self-raising flour (or same quantity plain flour and 3 tsp baking powder), 1 tsp salt, 100g chocolate chips or dried fruit such as sultanas or dried cherries (optional)', 'Heat oven to 200C/180C fan/gas 6. Line 2 muffin trays with paper muffin cases. In a large bowl beat 2 medium eggs lightly with a handheld electric mixer for 1 min.
Add 125ml vegetable oil and 250ml semi-skimmed milk and beat until just combined then add 250g golden caster sugar and whisk until you have a smooth batter.
Sift in 400g self-raising flour and 1 tsp salt (or 400g plain flour and 3 tsp baking powder if using) then mix until just smooth. Be careful not to over-mix the batter as this will make the muffins tough.
Stir in 100g chocolate chips or dried fruit if using.
Fill muffin cases two-thirds full and bake for 20-25 mins, until risen, firm to the touch and a skewer inserted in the middle comes out clean. If the trays will not fit on 1 shelf, swap the shelves around after 15 mins of cooking.
Leave the muffins in the tin to cool for a few mins and transfer to a wire rack to cool completely.', 'admin', 2);