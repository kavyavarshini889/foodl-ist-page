const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const pool = require('../db');
const upload = require('../middleware/upload');
const { hotelRules, handleErrors } = require('../middleware/validate');

const removeFile = (p) => {
  if (!p || p.startsWith('http')) return;
  fs.unlink(path.join(__dirname, '../../', p), () => {});
};

const SORTS = {
  newest: 'id DESC',
  price_asc: 'price ASC',
  price_desc: 'price DESC',
  title: 'title ASC',
};

// GET /api/hotels?title=&minPrice=&maxPrice=&sort=&limit=&offset=
router.get('/', async (req, res) => {
  try {
    const { title, minPrice, maxPrice } = req.query;
    const limit = parseInt(req.query.limit) || 6;
    const offset = parseInt(req.query.offset) || 0;
    const orderBy = SORTS[req.query.sort] || SORTS.newest;

    const where = [];
    const params = [];
    if (title)    { params.push(`%${title}%`); where.push(`title ILIKE $${params.length}`); }
    if (minPrice) { params.push(minPrice);     where.push(`price >= $${params.length}`); }
    if (maxPrice) { params.push(maxPrice);     where.push(`price <= $${params.length}`); }
    const clause = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const count = await pool.query(`SELECT COUNT(*) FROM hotels ${clause}`, params);
    const data = await pool.query(
      `SELECT * FROM hotels ${clause} ORDER BY ${orderBy}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );
    res.json({ total: parseInt(count.rows[0].count), hotels: data.rows });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/hotels/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM hotels WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Hotel not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/hotels
router.post('/', upload.single('image'), hotelRules, handleErrors, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ errors: [{ msg: 'Image is required' }] });
    const { title, description, latitude, longitude, price } = req.body;
    const imagePath = `uploads/${req.file.filename}`;
    const { rows } = await pool.query(
      `INSERT INTO hotels (title, description, image_path, latitude, longitude, price)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, description, imagePath, latitude, longitude, price]
    );
    res.status(201).json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/hotels/:id
router.put('/:id', upload.single('image'), hotelRules, handleErrors, async (req, res) => {
  try {
    const existing = await pool.query('SELECT * FROM hotels WHERE id = $1', [req.params.id]);
    if (!existing.rows.length) return res.status(404).json({ message: 'Hotel not found' });

    const { title, description, latitude, longitude, price } = req.body;
    let imagePath = existing.rows[0].image_path;
    if (req.file) {
      removeFile(imagePath);
      imagePath = `uploads/${req.file.filename}`;
    }
    const { rows } = await pool.query(
      `UPDATE hotels SET title=$1, description=$2, image_path=$3,
       latitude=$4, longitude=$5, price=$6 WHERE id=$7 RETURNING *`,
      [title, description, imagePath, latitude, longitude, price, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/hotels/:id
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM hotels WHERE id=$1 RETURNING image_path', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Hotel not found' });
    removeFile(rows[0].image_path);
    res.json({ message: 'Hotel deleted successfully' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;