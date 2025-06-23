# DVLA Renewal Sample Service (GDS Compliant)

This is a sample multi-step DVLA driving licence renewal service, built to be compliant with the GOV.UK Design System and progressive enhancement principles.

## Features
- Uses latest GOV.UK Frontend
- Multi-step form flow
- Works without JavaScript (progressive enhancement)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)

### Install dependencies
```
npm install
```

### Run the service
```
node app.js
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `app.js` - Main Express app
- `views/` - Nunjucks templates
- `public/` - Static assets (GOV.UK Frontend)

## Next Steps
- Add more steps to the renewal journey in `app.js` and `views/`
- Add controllers and routes for each step 