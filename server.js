const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

let db;

// ROUTES

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

MongoClient.connect(
  process.env.DB_URL,
  { useNewUrlParser: true },
  (err, client) => {
    if (err) return console.log(err);
    db = client.db(process.env.DB_NAME);
    app.listen(process.env.PORT, () => {
      console.log('Server is listening on port 3000');
    });
  }
);
