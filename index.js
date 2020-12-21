// REQUIRES
const express       = require('express');
const bodyParser    = require('body-parser');
const hbs           = require('hbs');
const path          = require('path');
const session       = require('express-session');

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
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret'
}));

//set routes
app.get('/', function(req, res) {
    res.render('home');
});

app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development')
        console.log(`Listening to http://${HOST}:${PORT}`);
});