//importing libs.
const fs = require('fs');
const express = require('express');
var bodyParser = require("body-parser");

//setting up app and config.
const hostname = '127.0.0.1';
const app = express();
const port = 80;
app.set('port', process.env.PORT || port);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname)); //so that the file of res.sendFile can source another file.
var coll;

//setting up mongoDB.
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017', function (err, client) {
  if (err) throw err;
  coll = client.db("mydb").collection('people');
  console.log("database connection established.");
});


let numOfAgents = 10;


//routings
app.get('/', (req, res) => {   //basic routing
  fs.readFile('randomData.json', 'utf8', function (err, contents) {
    res.send('Home page');
  });
  console.log("called readFile");
});

app.post('/dataPost', (req, res) => {

  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      coll.insertOne(req.body[key])
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
    }
  }

  // coll.insertOne(req.body)
  //   .then(result => {
  //     res.status(200).send({
  //       isSuccessful: true,
  //       type: 'SAVE',
  //       _id: result.ops.map(value => value._id)
  //     });
  //   })
  //   .catch(err => {
  //     res.send({ isSuccessful: false, data: err });
  //   });



});


app.get('/visitor', (req, res) => {
  let chartData = Array(numOfAgents);

  for(let x = 0; x < numOfAgents; x++){
    chartData[x] = [];
  }


  let collectionQuery = { dataType: req.query.dataType };
  coll.find(collectionQuery).toArray((err, items) => {
    let agentData = [];
    let signature = '';
    items.forEach(element => {
      agentData.push(element.dataValue);
      signature = element.signature;
    });

    chartData[0] = JSON.stringify(agentData);


    fs.readFile('./modules/chart.html', 'utf-8', function (err, data) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      var result = data.replace('"{{ chartData1 }}"', chartData[0]);
      var result = result.replace('"{{ label1 }}"', signature);
      res.write(result);
      res.end();
    });
  });

  
});

app.get('/clearData', (req, res) => {
  coll.remove();
  console.log("collection cleared");
  res.send("cleared.")
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
