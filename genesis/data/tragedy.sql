-- A Tragic Tale in SQL
-- (Even databases can tell stories)

CREATE TABLE characters (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    alive BOOLEAN DEFAULT TRUE,
    hope INTEGER DEFAULT 100
);

INSERT INTO characters (name) VALUES
    ('Hero'),
    ('Mentor'),
    ('Villain'),
    ('Love Interest');

-- Act 1: The Beginning
SELECT name, alive, hope
FROM characters
WHERE alive = TRUE;
-- Everyone is alive. Hope is high. The world is bright.

-- Act 2: The Mentor's Sacrifice
UPDATE characters
SET alive = FALSE
WHERE name = 'Mentor';

UPDATE characters
SET hope = hope - 30
WHERE name = 'Hero';

-- The mentor dies. The hero's hope drops to 70.
-- This is where the story turns dark.

-- Act 3: Descending Into Darkness
UPDATE characters
SET hope = hope - 40
WHERE name = 'Hero';

-- Hope at 30. The hero is broken.

SELECT
    name,
    CASE
        WHEN hope < 50 THEN 'losing faith'
        WHEN hope < 80 THEN 'struggling'
        ELSE 'hopeful'
    END as emotional_state
FROM characters
WHERE name = 'Hero';

-- Act 4: The Revelation
INSERT INTO characters (name, alive, hope)
VALUES ('Inner Strength', TRUE, 100);

-- Something awakens within

UPDATE characters
SET hope = 100
WHERE name = 'Hero';

-- Hope restored!

-- Act 5: The Final Battle
DELETE FROM characters WHERE name = 'Villain';
-- The villain is removed from the table
-- (Death is just a DELETE statement)

-- Epilogue: Who Remains?
SELECT
    name,
    alive,
    hope,
    CASE
        WHEN name = 'Hero' THEN 'Found strength within'
        WHEN name = 'Love Interest' THEN 'Stood by their side'
        WHEN name = 'Inner Strength' THEN 'Was there all along'
        ELSE 'Gone but not forgotten'
    END as fate
FROM characters
WHERE alive = TRUE
ORDER BY hope DESC;

-- THE END
-- (Run these queries in order to experience the narrative)

-- MORAL: Even in a database, we are just rows in a table,
--        waiting for the right UPDATE statement to change our story.

DROP TABLE IF EXISTS characters;
-- And in the end, we all get garbage collected.
