INSERT INTO skin_types (name) VALUES
('Oily'), ('Dry'), ('Combination'), ('Normal')
ON CONFLICT (name) DO NOTHING;

INSERT INTO ingredients (name, description, compatibility)
VALUES 
('ingredientName', 'Description.', '{"Oily": "compatibility", "Dry": "compatibility", "Combination": "compatibility", "Normal": "compatibility"}')
ON CONFLICT (name) DO NOTHING;

INSERT INTO ingredient_skin_compatibility (ingredient_id, skin_type_id, rating)
VALUES 
((SELECT id FROM ingredients WHERE name = 'ingredientName'), (SELECT id FROM skin_types WHERE name = 'Oily'), 'compatibility'),
((SELECT id FROM ingredients WHERE name = 'ingredientName'), (SELECT id FROM skin_types WHERE name = 'Dry'), 'compatibility'),
((SELECT id FROM ingredients WHERE name = 'ingredientName'), (SELECT id FROM skin_types WHERE name = 'Combination'), 'compatibility'),
((SELECT id FROM ingredients WHERE name = 'ingredientName'), (SELECT id FROM skin_types WHERE name = 'Normal'), 'compatibility')
ON CONFLICT DO NOTHING;


-- EXAMPLES
INSERT INTO ingredients (name, description, compatibility)
VALUES 
('Water', 'The base ingredient for most skincare formulations.', '{"Oily": "Best", "Dry": "Best", "Combination": "Good", "Normal": "Best"}')
ON CONFLICT (name) DO NOTHING;

-- EXAMPLES
INSERT INTO ingredient_skin_compatibility (ingredient_id, skin_type_id, rating)
VALUES 
((SELECT id FROM ingredients WHERE name = 'Water'), (SELECT id FROM skin_types WHERE name = 'Oily'), 'Best'),
((SELECT id FROM ingredients WHERE name = 'Water'), (SELECT id FROM skin_types WHERE name = 'Dry'), 'Best'),
((SELECT id FROM ingredients WHERE name = 'Water'), (SELECT id FROM skin_types WHERE name = 'Combination'), 'Good'),
((SELECT id FROM ingredients WHERE name = 'Water'), (SELECT id FROM skin_types WHERE name = 'Normal'), 'Best')
ON CONFLICT DO NOTHING;