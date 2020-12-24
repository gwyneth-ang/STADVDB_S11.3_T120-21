// REQUIRES
const express       = require('express');
const bodyParser    = require('body-parser');
const hbs           = require('hbs');
const path          = require('path');
const mysql         = require('mysql');

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

//connect to mysql
/*const db = mysql.createConnection({
    host : 'localhost',
    user: "root",
    password: 'password',
    database: 'imdb movies extensive db',
    port: 3306
});

global.db = db;

db.connect((err) => {
    if(err){
        // console.log("Here");
        throw err;
    }
    else {
        console.log('Connected to database');
    }
});*/

//sample query
/*let resident = "SELECT r.ResidentID FROM Resident r JOIN User u ON u.UserID = r.UserID WHERE u.UserID =" + req.session.userID.userID +";";
db.query(resident, (err, result) => {
    if (result.length > 0)
        res.redirect('/residentHome');
    else
        res.redirect('/login');
    });*/


//set routes
app.get('/', function(req, res) {
    res.render('home');
});

app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development')
        console.log(`Listening to http://${HOST}:${PORT}`);
});