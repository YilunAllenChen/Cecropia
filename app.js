//importing libs.
const fs = require('fs');
const express = require('express');
var bodyParser = require("body-parser");
var DP = require("./modules/dataPost");  //data point prototype

//setting up app and config.
const hostname = '127.0.0.1';
const app = express();
const port = 80;
app.set('port', process.env.PORT || port);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname)); //so that the file of res.sendFile can source another file.


//init of variables
var data;

//setting up mongoDB.
const MongoClient = require('mongodb').MongoClient;
let coll;
MongoClient.connect('mongodb://localhost:27017', function (err, client) {
  if (err) throw err;
  const database = client.db("mydb"); 
  coll = database.collection('people');
});



//routings
app.get('/', (req, res) => {   //basic routing
  fs.readFile('data.txt', 'utf8', function (err, contents) {
    data = contents;
    res.send('Home page' + data);
  });
  console.log("called readFile");
});

// app.get('/data', (req, res) => {
//   var co = req.query;  //receive the query. http req: in form link/?key=value&key=value&key=value.
//   console.log(co);
//   coll.insertOne(co);
//   coll.find({ id: '1301' }).toArray((err, items) => {
//     console.log(items)
//   })
//   console.log("called readFile");
// });


app.post('/dataPost', (req, res) => {
  coll.insertOne(req.body)
    .then(result => {
      res.status(200).send({
        isSuccessful: true,
        type: 'SAVE',
        _id: result.ops.map(value => value._id)
      });
    })
    .catch(err => {
      res.send({ isSuccessful: false, data: err });
    });
});


app.get('/visitor', (req, res) => {    //example of opening up another file under the same dir.
  res.sendFile('/visitorPage.html', { root: __dirname });  //file path must be absolute.
  console.log("called sendFile");
});

app.get('/clearData', (req, res) => {
  coll.remove();
  console.log("collection   coll' cleared");
});

//app error config.
app.use((req, res) => {
  res.type('text/plain');
  res.status(505);
  res.send('Error page');
});

//let the app listen.
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
