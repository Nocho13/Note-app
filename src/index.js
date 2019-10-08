const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');
const multer = require('multer');
const uuid = require('uuid/v4');
const { format } = require('timeago.js');

// Initializations
const app = express();
require('./database');
require('./config/passport');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
  }));
app.set('view engine', '.hbs');
// middlewares  se procesan antes de llegar a las rutas
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method')); //formularios metodos put,delete...
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/img/uploads'),
  filename: (req, file, cb, filename) => {
      console.log(file);
      cb(null, uuid() + path.extname(file.originalname));
  }
}) 
app.use(multer({storage}).single('image'));

         //passport despues de express
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// routes
app.use(require('./routes'));
app.use(require('./routes/users'));
app.use(require('./routes/notes'));
app.use(require('./routes/responsable'));


// static files
app.use(express.static(path.join(__dirname, 'public')));

// Server is listening
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});