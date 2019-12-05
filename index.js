const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
// inicializar
const app = express();
require('./db');
require('./passport/local-auth');


// configuraciones
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT ||3000 )

// middlewares

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: 'sesionsecreta',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signupMsg = req.flash('signupMsg');
  app.locals.signinMsg = req.flash('signinMsg');
  app.locals.user = req.user;
  console.log(app.locals);
  next();
});

//rutas
app.use('/', require('./routes/index'));

// iniciando el server
app.listen(app.get('port'), () => {

  console.log('Server en puerto', app.get('port'));

});

// archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));