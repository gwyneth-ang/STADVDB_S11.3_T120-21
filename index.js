// REQUIRES
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const path = require('path');
const mysql = require('mysql');

require('dotenv').config()

const app = express();

// DEV REQUIRES
let morgan
if (process.env.NODE_ENV === 'development') {
    morgan = require('morgan');
}

// GLOBAL VARIABLES
const HOST = process.env.HOST;
const PORT = process.env.PORT;

//set view engine
hbs.registerPartials(path.join(__dirname, '/views/_partials'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//hbs helpers
const hbsHelpers = require(__dirname + '/modules/hbsHelpers.js');

hbs.registerHelper(hbsHelpers);

// set the folder `public` as folder containing static assets
// such as stylesheets, javascripts, and image files
app.use(express.static(path.join(__dirname, '/public')));

// middlewares
if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

app.use(express.json());
app.use(bodyParser.urlencoded({
    limit: '5mb',
    parameterLimit: 100000,
    extended: true,
}));

//connect to mysql
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

global.db = db;

db.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log('Connected to database');
    }
});

//set routes
const searchRouter = require('./routes/searchRouter');

app.use('/', searchRouter);

app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development')
        console.log(`Listening to http://${HOST}:${PORT}`);
});