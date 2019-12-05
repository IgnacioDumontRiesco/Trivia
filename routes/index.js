const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');




router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup' ,{

  successRedirect : '/profile',
  failureRedirect : '/signup',
  passReqToCallback : true

}));


router.get('/signin', (req, res, next) => {
  res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {

  successRedirect: '/profile',
  failureRedirect: '/signin',
  passReqToCallback: true

}));


router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});


router.get('/profile', isAuthenticated, (req, res, next) =>{
  res.render('profile');
});


router.get('/questionadd', async (req, res) => {
  const questions = await Question.find();
  const answers = await Answer.find();
  res.render('questionadd', {
    questions,
    answers
  });
});

// preguntas
const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
});

const Question = mongoose.model('Question', QuestionSchema);

const AnswerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isRight: { type: Boolean, default: false },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
});

const Answer = mongoose.model('Answer', AnswerSchema);

router.post('/questionadd', (req, res) => {
  let question = new Question({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.question
  });
  let answerA = new Answer({
    title: req.body.answerA,
    isRight: req.body.checkboxA,
    question: question._id
  });
  let answerB = new Answer({
    title: req.body.answerB,
    isRight: req.body.checkboxB,
    question: question._id
  });
  let answerC = new Answer({
    title: req.body.answerC,
    isRight: req.body.checkboxC,
    question: question._id
  });
  let answerD = new Answer({
    title: req.body.answerD,
    isRight: req.body.checkboxD,
    question: question._id

  });
  question.answers.push(answerA);
  question.answers.push(answerB);
  question.answers.push(answerC);
  question.answers.push(answerD);
  question.save(err => {
    answerA.save();
    answerB.save();
    answerC.save();
    answerD.save();
    res.redirect('/trivia');
  });
});



router.get('/trivia', (req, res) => {
  Question.find().populate('answers').exec((err, questions) => {
    console.log(questions);
    res.render('trivia', { questions: questions, user: req.user });
  });
});


function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next ();
  }
  res.redirect('/signin');
};

module.exports = router;

