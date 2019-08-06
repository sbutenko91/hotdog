var express = require('express');
var exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const router = express.Router();
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

var app = express();
var root = process.cwd();

// Load routes
const hotdogs = require('./routes/hotdogs');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/database')

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))

var compileSass = require('express-compile-sass');
var path = require("path");


// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

// Method override middleware
app.use(methodOverride('_method'));


// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        maxAge: 24*60*60*1000,
        expires: false
    }
}));

// Pasport middleware --------------- After session IMPORTANT!!!
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//Use routes
app.use('/hotdogs', hotdogs);
app.use('/users', users);

// Index page
app.get('/', (req, res) => {
        res.render('users/login')
});

const port = process.env.PORT || 5000;

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


module.exports = router;