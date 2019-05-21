//importing libs.
const fs = require('fs');
const express = require('express');


//setting up server
const hostname = '127.0.0.1';
const server = express();
const port = 80;
server.set('port', process.env.PORT || port);

//init of variables
var data;

//setting up mongoDB.
const MongoClient = require('mongodb').MongoClient;
var names;
MongoClient.connect('mongodb://localhost:27017', function(err, client) {
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
  names.find({id: '1301'}).toArray((err, items) => {
    console.log(items)
  })
  console.log("called readFile"); 
});


server.post('/dataPost', (request, response) => {
  var co = response.json(request.body);  //receive the query. http request: in form link/?key=value&key=value&key=value.
  console.log(co);
  console.log("POST completed"); 
  response.end("Got you. " + co);
});


server.get('/visitor', (request, response) => {    //example of opening up another file under the same dir.
  response.sendFile('/visitorPage.html', {root: __dirname});  //file path must be absolute.
  console.log("called sendFile");
});

server.get('/clearData', (request, response) => {
  names.remove();
  console.log("collection 'names' cleared") ; 
});




//server config.
server.use(express.json()); // for parsing application/json
server.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
server.use(express.static(__dirname)); //so that the file of res.sendFile can source another file.
server.use((request,response)=>{
  response.type('text/plain');
  response.status(505);
  response.send('Error page');
});

//let the server listen.
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});