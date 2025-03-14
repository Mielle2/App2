CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    compatibility JSONB DEFAULT '{}'
);

CREATE TABLE skin_types (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE ingredient_skin_compatibility (
    id SERIAL PRIMARY KEY,
    ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
    skin_type_id INTEGER REFERENCES skin_types(id) ON DELETE CASCADE,
    rating TEXT NOT NULL
);