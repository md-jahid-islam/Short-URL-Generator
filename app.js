const shortId = require('shortid');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Url = require('./models/Url');

const app = express();
const mongoose = require('mongoose');
const shortId = require('shortid');

const urlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: shortId.generate,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model('Url', urlSchema);

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/shorturl', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/', async (req, res) => {
  const urls = await Url.find();
  res.render('index', { urls });
});

app.get('/shorten', async (req, res) => {
  const { fullUrl } = req.body;
  await Url.create({ fullUrl });
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  const url = await Url.findOne({ shortUrl: req.params.shortUrl });
  if (!url) return res.sendStatus(404);

  url.clicks++;
  await url.save();

  res.redirect(url.fullUrl);
});

// Start server
app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});
