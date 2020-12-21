const path = require('path');
const express = require('express');
const hbs = require('hbs');
const HOST = 'localhost';
const PORT = process.env.PORT | 8000;
const app = express();

require('dotenv').config()

// Handlebars
app.set('view engine', 'hbs');

//set routes
app.get('/', function(req, res) {
    res.render('home');
});

// Express static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Server on port' + PORT));