const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Nunjucks
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Basic route (start page)
app.get('/', (req, res) => {
  res.render('start.njk');
});

app.use(express.urlencoded({ extended: false }));

// Step 1: Full name
app.get('/step-1', (req, res) => {
  res.render('step-1.njk');
});
app.post('/step-1', (req, res) => {
  res.redirect('/step-2');
});

// Step 2: Date of birth
app.get('/step-2', (req, res) => {
  res.render('step-2.njk');
});
app.post('/step-2', (req, res) => {
  res.redirect('/step-3');
});

// Step 3: Licence number
app.get('/step-3', (req, res) => {
  res.render('step-3.njk');
});
app.post('/step-3', (req, res) => {
  res.redirect('/step-4');
});

// Step 4: Licence expiry date
app.get('/step-4', (req, res) => {
  res.render('step-4.njk');
});
app.post('/step-4', (req, res) => {
  res.redirect('/step-5');
});

// Step 5: Address
app.get('/step-5', (req, res) => {
  res.render('step-5.njk');
});
app.post('/step-5', (req, res) => {
  res.redirect('/check-answers');
});

// Step 6: Check answers
app.get('/check-answers', (req, res) => {
  res.render('check-answers.njk');
});
app.post('/check-answers', (req, res) => {
  res.redirect('/confirmation');
});

// Step 7: Confirmation
app.get('/confirmation', (req, res) => {
  res.render('confirmation.njk');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 