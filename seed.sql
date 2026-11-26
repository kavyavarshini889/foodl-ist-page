-- Run after schema.sql:
--   psql -U postgres -d hoteldb -f backend/seed.sql
-- Safe to run more than once: a hotel is skipped if its title already exists.

CREATE TABLE IF NOT EXISTS hotels (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  image_path  TEXT NOT NULL,
  latitude    DOUBLE PRECISION NOT NULL,
  longitude   DOUBLE PRECISION NOT NULL,
  price       NUMERIC(10,2) NOT NULL CHECK (price > 0),
  created_at  TIMESTAMP DEFAULT NOW()
);

INSERT INTO hotels (title, description, image_path, latitude, longitude, price)
SELECT v.title, v.description, v.image_path, v.latitude, v.longitude, v.price
FROM (VALUES
  ('Marina Sky Resort',
   'Beachfront resort on Chennai''s Marina coast with a rooftop pool, sea-view rooms and an all-day multi-cuisine restaurant.',
   'https://tse4.mm.bing.net/th/id/OIP.BpNfnKDnhx_6HGtebUEedwHaFj?r=0&pid=Api&h=220&P=0',
   13.0500, 80.2824, 8500.00),

  ('Goa Sunset Villa',
   'Private villa a short walk from the beach, with a garden pool, open-air lounge and sunset views over the coast.',
   'https://tse3.mm.bing.net/th/id/OIP.9qEPJR-PBhu5JrS9mxr69AHaEO?r=0&pid=Api&h=220&P=0',
   15.5527, 73.7517, 11500.00),

  ('Ganga Riverside Retreat',
   'Peaceful riverside stay in Rishikesh offering yoga decks, Ganga-facing rooms and organic vegetarian meals.',
   'https://tse2.mm.bing.net/th/id/OIP.ikPgw-JWX1l9ehwqJAA5-gHaE7?r=0&pid=Api&h=220&P=0',
   30.0869, 78.2676, 4200.00),

  ('Silicon Valley Inn',
   'Modern business hotel in the heart of Bengaluru with fast Wi-Fi, co-working lounge and airport shuttle.',
   'https://www.bestwestern.no/images/51c10b3d-9f0b-43ec-a26a-303460a11ec2__bwimages__large__24421930.webp',
   12.9716, 77.5946, 5600.00),

  ('Himalaya Peak Lodge',
   'Cosy wooden lodge in Manali surrounded by snow-capped peaks, with a fireplace lounge and trekking desk.',
   'https://tse4.mm.bing.net/th/id/OIP.WfAKXINtFjJYDLHn1qzxyQHaFY?r=0&pid=Api&h=220&P=0',
   32.2396, 77.1887, 6800.00),

  ('Backwater Bliss',
   'Traditional Kerala stay on the Alleppey backwaters with houseboat rides, Ayurvedic spa and local cuisine.',
   'https://tse2.mm.bing.net/th/id/OIP.W6UHWvdYMt2V6irQ5OKVpwHaF7?r=0&pid=Api&h=220&P=0',
   9.4981, 76.3388, 7200.00),

  ('Fort Heritage Palace',
   'Restored royal palace in Jaipur with courtyard dining, antique interiors and guided heritage tours.',
   'https://tse2.mm.bing.net/th/id/OIP.C8l6vWUxSCBbX0MGMBxxFQHaFK?r=0&pid=Api&h=220&P=0',
   26.9124, 75.7873, 13500.00),

  ('Neon Grid Suites',
   'Stylish tech-district suites in Hyderabad with smart rooms, skyline views and a 24-hour cafe.',
   'https://tse3.mm.bing.net/th/id/OIP.TiddweJs7yzvAvwRcQKDAQHaFl?r=0&pid=Api&h=220&P=0',
   17.4435, 78.3772, 6200.00),

  ('Temple Town Residency',
   'Comfortable family hotel near the Meenakshi Temple in Madurai, with traditional South Indian breakfast.',
   'https://tse2.mm.bing.net/th/id/OIP.HK8Q5Act_e23HpkR_snq0gHaED?r=0&pid=Api&h=220&P=0',
   9.9195, 78.1193, 2400.00),

  ('Coral Bay Beach Hotel',
   'Relaxed seaside hotel in Pondicherry with direct beach access, French-quarter walks and seafood restaurant.',
   'https://tse3.mm.bing.net/th/id/OIP.n2ySJ6tSg-kgZRZzoEvPBAHaE8?r=0&pid=Api&h=220&P=0',
   11.9416, 79.8083, 5100.00),

  ('Lake Pichola View',
   'Lake-facing rooms in Udaipur with a terrace restaurant overlooking the City Palace and evening boat rides.',
   'https://tse2.mm.bing.net/th/id/OIP.rA3KjrdSQO9Fe3_qIzWrMQHaE8?r=0&pid=Api&h=220&P=0',
   24.5760, 73.6800, 9800.00),

  ('Desert Mirage Camp',
   'Luxury tented camp near Jaisalmer with camel safaris, folk music evenings and stargazing under open skies.',
   'https://thumbs.dreamstime.com/b/cozy-desert-camp-view-surreal-otherworldly-sunset-mirage-cozy-desert-camp-view-surreal-otherworldly-sunset-278302844.jpg',
   26.9157, 70.9083, 7500.00),

  ('Cyber Pod Capsule Hotel',
   'Compact, budget-friendly capsule pods in Mumbai with private lockers, shared lounge and quick metro access.',
   'https://tse4.mm.bing.net/th/id/OIP.-5cGVj3Ilwxxq34njviPLQHaE8?r=0&pid=Api&h=220&P=0',
   19.0760, 72.8777, 1500.00),

  ('Tea Hills Cottage',
   'Quiet cottage among the tea estates of Munnar, with valley-view balconies, bonfire evenings and guided plantation walks.',
   'https://images.stockcake.com/public/c/5/f/c5f547c5-3456-41b1-8213-3a912c54df3d_large/serene-hillside-retreat-stockcake.jpg',
   10.0889, 77.0595, 3600.00)
) AS v(title, description, image_path, latitude, longitude, price)
WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.title = v.title);