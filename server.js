const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  { MongoClient, ObjectId } = require('mongodb'),
  dotenv = require('dotenv'),
  passport = require('passport'),
  localStrategy = require('passport-local'),
  passportLocalMongoose = require('passport-local-mongoose'),
  session = require('express-session'),
  User = require('./models/user'),
  MongoDBStore = require('connect-mongodb-session');

dotenv.config();
mongoose.connect(process.env.DB_URL);

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

// ROUTES
//==================================================
// index route
app.get('/', (req, res) => {
  db.collection(process.env.DB_COLLECTION)
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);
      res.render('index.ejs', { questions: result });
    });
});

// questions routes
app.get('/questions/edit', (req, res) => {
  db.collection(process.env.DB_COLLECTION)
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);
      res.render('edit.ejs', { questions: result });
    });
});

app.post('/questions', (req, res) => {
  db.collection(process.env.DB_COLLECTION).insertOne(
    req.body,
    (err, result) => {
      if (err) return console.log(err);
      res.redirect('/questions/edit');
    }
  );
});

app.put('/questions/:id', (req, res) => {
  db.collection(process.env.DB_COLLECTION)
    .updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body })
    .then(() => res.sendStatus(200));
});

app.delete('/questions/:id', (req, res) => {
  db.collection(process.env.DB_COLLECTION)
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then(() => res.sendStatus(200));
});

// catch favicon error
app.get('/favicon.ico', (req, res) => res.status(204));

// create mongo connection and store database in db variable
// MongoClient.connect(
//   // process.env.DB_URL,
//   'mongodb://localhost/iqauth',
//   { useNewUrlParser: true },
//   (err, client) => {
//     if (err) return console.log(err);
//     db = client.db(process.env.DB_NAME);
//     app.listen(process.env.PORT, () => {
//       console.log('Server is listening on port 3000');
//     });
//   }
// );
