const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Nunjucks
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set up express-session middleware
app.use(session({
  secret: 'gds-renewal-secret',
  resave: false,
  saveUninitialized: true
}));

// Basic route (start page)
app.get('/', (req, res) => {
  res.render('start.njk');
});

app.use(express.urlencoded({ extended: false }));

// Step 1: Full name
app.get('/step-1', (req, res) => {
  res.render('step-1.njk', { fullName: req.session.fullName });
});
app.post('/step-1', (req, res) => {
  req.session.fullName = req.body.fullName;
  res.redirect('/step-2');
});

// Step 2: Date of birth
app.get('/step-2', (req, res) => {
  res.render('step-2.njk', {
    dobDay: req.session.dobDay,
    dobMonth: req.session.dobMonth,
    dobYear: req.session.dobYear
  });
});
app.post('/step-2', (req, res) => {
  const { 'dob-day': day, 'dob-month': month, 'dob-year': year } = req.body;
  const now = new Date();
  let error = null;
  // Validate numbers
  if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
    error = 'Enter a valid date of birth';
  } else {
    const dob = new Date(year, month - 1, day);
    if (dob.getFullYear() != year || dob.getMonth() != month - 1 || dob.getDate() != Number(day)) {
      error = 'Enter a valid date of birth';
    } else if (dob > now) {
      error = 'Date of birth cannot be in the future';
    } else if (dob < new Date(now.getFullYear() - 150, now.getMonth(), now.getDate())) {
      error = 'Date of birth cannot be more than 150 years ago';
    }
  }
  if (error) {
    return res.render('step-2.njk', {
      error,
      dobDay: day,
      dobMonth: month,
      dobYear: year
    });
  }
  req.session.dobDay = day;
  req.session.dobMonth = month;
  req.session.dobYear = year;
  res.redirect('/step-3');
});

// Step 3: Licence number
app.get('/step-3', (req, res) => {
  res.render('step-3.njk', { licenceNumber: req.session.licenceNumber });
});
app.post('/step-3', (req, res) => {
  const { licenceNumber } = req.body;
  // UK licence number: 5 letters/numbers (surname), 6 numbers (DOB/gender), 2 letters/numbers (initials), 1 number, 2 numbers (16 chars)
  const licenceRegex = /^[A-Z9]{5}[0-9]{6}[A-Z9]{2}[0-9]{1}[0-9]{2}$/i;
  let error = null;
  if (!licenceNumber || !licenceRegex.test(licenceNumber)) {
    error = 'Enter a valid UK driving licence number (for example: MORGA857116J9999)';
    return res.render('step-3.njk', { error, licenceNumber });
  }
  req.session.licenceNumber = licenceNumber;
  res.redirect('/step-4');
});

// Step 4: Licence expiry date
app.get('/step-4', (req, res) => {
  res.render('step-4.njk', {
    expiryDay: req.session.expiryDay,
    expiryMonth: req.session.expiryMonth,
    expiryYear: req.session.expiryYear
  });
});
app.post('/step-4', (req, res) => {
  const { 'expiry-day': day, 'expiry-month': month, 'expiry-year': year } = req.body;
  let error = null;
  if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
    error = 'Enter a valid expiry date';
  } else {
    const expiry = new Date(year, month - 1, day);
    if (expiry.getFullYear() != year || expiry.getMonth() != month - 1 || expiry.getDate() != Number(day)) {
      error = 'Enter a valid expiry date';
    }
  }
  if (error) {
    return res.render('step-4.njk', {
      error,
      expiryDay: day,
      expiryMonth: month,
      expiryYear: year
    });
  }
  req.session.expiryDay = day;
  req.session.expiryMonth = month;
  req.session.expiryYear = year;
  res.redirect('/step-5');
});

// Step 5: Address
app.get('/step-5', (req, res) => {
  res.render('step-5.njk', {
    addressLine1: req.session.addressLine1,
    addressLine2: req.session.addressLine2,
    addressTown: req.session.addressTown,
    addressCounty: req.session.addressCounty,
    addressPostcode: req.session.addressPostcode
  });
});
app.post('/step-5', (req, res) => {
  const { addressLine1, addressLine2, addressTown, addressCounty, addressPostcode } = req.body;
  // UK postcode regex (case insensitive, allows space or no space)
  const postcodeRegex = /^([A-Z]{1,2}[0-9][0-9A-Z]? ?[0-9][A-Z]{2})$/i;
  let postcodeError = null;
  let error = null;
  if (!addressPostcode || !postcodeRegex.test(addressPostcode.trim())) {
    postcodeError = 'Enter a valid UK postcode (for example: SW1A 1AA)';
    error = postcodeError;
  }
  if (error) {
    return res.render('step-5.njk', {
      error,
      postcodeError,
      addressLine1,
      addressLine2,
      addressTown,
      addressCounty,
      addressPostcode
    });
  }
  req.session.addressLine1 = addressLine1;
  req.session.addressLine2 = addressLine2;
  req.session.addressTown = addressTown;
  req.session.addressCounty = addressCounty;
  req.session.addressPostcode = addressPostcode;
  res.redirect('/check-answers');
});

// Step 6: Check answers
app.get('/check-answers', (req, res) => {
  res.render('check-answers.njk', {
    fullName: req.session.fullName,
    dobDay: req.session.dobDay,
    dobMonth: req.session.dobMonth,
    dobYear: req.session.dobYear,
    licenceNumber: req.session.licenceNumber,
    expiryDay: req.session.expiryDay,
    expiryMonth: req.session.expiryMonth,
    expiryYear: req.session.expiryYear,
    addressLine1: req.session.addressLine1,
    addressLine2: req.session.addressLine2,
    addressTown: req.session.addressTown,
    addressCounty: req.session.addressCounty,
    addressPostcode: req.session.addressPostcode
  });
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