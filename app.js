//importing libs.
const fs = require('fs');
const express = require('express');
var bodyParser = require("body-parser");
var DP = require("./modules/dataPost");  //data point prototype

//setting up server and config.
const hostname = '127.0.0.1';
const server = express();
const port = 80;
server.set('port', process.env.PORT || port);
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(express.static(__dirname)); //so that the file of res.sendFile can source another file.


//init of variables
var data;

//setting up mongoDB.
const MongoClient = require('mongodb').MongoClient;
let names;
MongoClient.connect('mongodb://localhost:27017', function (err, client) {
  if (err) throw err;
  console.log("Database created!");
  const database = client.db("mydb"); 
  names = database.collection('people');
});



//routings
server.get('/', (request, response) => {   //basic routing
  fs.readFile('data.txt', 'utf8', function (err, contents) {
    data = contents;
    response.send('Home page' + data);
  });
  console.log("called readFile");
});

server.get('/data', (request, response) => {
  var co = request.query;  //receive the query. http request: in form link/?key=value&key=value&key=value.
  console.log(co);
  names.insertOne(co);
  names.find({ id: '1301' }).toArray((err, items) => {
    console.log(items)
  })
  console.log("called readFile");
});


server.post('/dataPost', (req, res) => {
  names.insertOne(req.body)
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


server.get('/visitor', (request, response) => {    //example of opening up another file under the same dir.
  response.sendFile('/visitorPage.html', { root: __dirname });  //file path must be absolute.
  console.log("called sendFile");
});

server.get('/clearData', (request, response) => {
  names.remove();
  console.log("collection 'names' cleared");
});

//server error config.
server.use((request, response) => {
  response.type('text/plain');
  response.status(505);
  response.send('Error page');
});

//let the server listen.
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
