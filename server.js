const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  mongoose = require('mongoose'),
  dotenv = require('dotenv'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  passportLocalMongoose = require('passport-local-mongoose'),
  session = require('express-session'),
  User = require('./models/user'),
  Question = require('./models/question'),
  MongoDBStore = require('connect-mongodb-session'),
  db = require('./models');

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// sessions config
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// HELPERS
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// ROUTES
//==================================================
// index
app.get('/', (req, res) => {
  db.questions.find().then(result => {
    res.render('index', { questions: result });
  });
});

// login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/questions/edit',
    failureRedirect: '/'
  })
);

// register
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        return res.render('register');
      }

      passport.authenticate('local')(req, res, () => {
        res.redirect('/questions/edit');
      });
    }
  );
});

// questions routes
app.put('/questions/:id', (req, res) => {
  Question.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    req.body,
    (err, question) => {
      if (err) {
        console.log(err);
      }
      res.sendStatus(200);
    }
  );
});

app.delete('/questions/:id', (req, res) => {
  Question.deleteOne({ _id: req.params.id }, err => {
    if (err) {
      console.log(err);
    }
    res.sendStatus(200);
  });
});

app.get('/questions/edit', isLoggedIn, (req, res) => {
  db.questions.find().then(result => {
    res.render('edit', { questions: result });
  });
});

app.post('/questions', isLoggedIn, (req, res) => {
  req.body.author = req.user.username;

  Question.create(req.body, (err, question) => {
    if (err) {
      console.log(err);
    }
    console.log(question);
    res.redirect('/');
  });
});

// // catch favicon error
app.get('/favicon.ico', (req, res) => res.status(204));

app.listen(process.env.PORT, () => {
  console.log('server listening on port 3000...');
});
