require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/hotels', require('./routes/hotels'));

app.use((err, req, res, next) => res.status(400).json({ errors: [{ msg: err.message }] }));

app.listen(process.env.PORT, () => console.log(`API running on port ${process.env.PORT}`));
