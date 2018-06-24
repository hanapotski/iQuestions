const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { MongClient, ObjectId } = require('mongodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

let db;

MongoClient.connect(
  process.env.DB_URL,
  (err, client) => {
    if (err) return console.log(err);
    db = client.db(process.env.DB_NAME);
    app.listen(3000, () => {
      console.log('Server is listening on port 3000');
    });
  }
);
