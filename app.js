const fs = require('fs');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
var names;


const hostname = '192.168.137.133';
MongoClient.connect('mongodb://localhost:27017', function(err, client) {
  if (err) throw err;
  console.log("Database created!");
  const database = client.db("mydb");
  names = database.collection('people');
});


const server = express();
const port = 80;
var data;
server.set('port', process.env.PORT || port);

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
  fs.readFile('data.txt', 'utf8', function (err, contents) {
    data = contents;
    response.send('hiiii' + data);

  });
  console.log("called readFile"); 
});

server.get('/other', (request, response) => {
  response.sendFile(__dirname + 'othersite.html');  //file path must be absolute.
  console.log("called sendFile");
});

server.get('/clearData', (request, response) => {
  names.remove();
  
  console.log("collection 'names' cleared"); 
});


server.use((request,response)=>{
  response.type('text/plain');
  response.status(505);
  response.send('Error page');
});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});