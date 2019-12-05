const passport = require ('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser ((user, done) => {
  done(null, user.id);
});

passport.deserializeUser (async(id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {

  const user = await User.findOne({email: email});
  if(user) {
    return done(null, false, req.flash('signupMsg', 'Ya hay una cuenta creada con ese correo electronico'));
  } else {
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.passwordEncrypt(password);
    await newUser.save();
    done(null, newUser);
  }


} ));

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {

  const user = await User.findOne({email:email});

  if(!user) {
    return done(null, false, req.flash('signinMsg', 'UsuarioContraseña incorrectos'));
  }
  if(!user.passwordValidation(password)) {
    return done(null, false, req.flash('signinMsg', 'Usuario/Contraseña incorrectos'));
  }
  done(null, user);

}));
