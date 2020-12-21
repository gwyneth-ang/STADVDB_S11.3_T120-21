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
const HOST = 'localhost';
const PORT = process.env.PORT;

//set view engine
hbs.registerPartials(path.join(__dirname, '/views/_partials'), () => process.env.NODE_ENV === 'development' ? console.log('Registred Partials') : '');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set the folder `public` as folder containing static assets
// such as css, js, and image files
app.use(express.static(path.join(__dirname, '/public')));

if (process.env.NODE_ENV === 'develpment')
    app.use(morgan('dev'));

//set routes
app.get('/', function(req, res) {
    res.render('home');
});

app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development')
        console.log(`Listening to http://${HOST}:${PORT}`);
});