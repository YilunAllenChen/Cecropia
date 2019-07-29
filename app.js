//declaring variables.
let numOfAgents = 10;


//importing libs.
const fs = require('fs');
const express = require('express');
var bodyParser = require("body-parser");
let dataParser = require('./modules/dataParser');
var moment = require('moment');
moment().format();


//setting up app and config.
const hostname = '192.168.137.1';
const app = express();
const port = 80;
app.set('port', process.env.PORT || port);
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(__dirname)); //so that the file of res.sendFile can source another file.


//setting up mongoDB.
var coll;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://' + hostname + ':27017', {
  useNewUrlParser: true
}, function (err, client) {
  if (err) throw err;
  coll = client.db("mydb").collection('agentData');
  console.log('database connection established.');
});


//routings
app.get('/', (req, res) => { //basic routing
  res.sendFile('./index.html', {
    root: __dirname
  });
});

app.post('/dataPost', (req, res) => {
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      coll.insertOne(req.body[key])
    }
  }
  console.log("new data received");
  res.status(200).send({
    isSuccessful: true,
    type: 'SAVE'
  });

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
  //   console.log('dataPost received:');
  //   console.log(req.body);

});


app.get('/visitor', (req, res) => {
  let currentTime = parseInt(moment().add(1, 'day').format("YYYYMMDDHH"));
  let since = parseInt(moment().subtract(req.query.timeScope, 'day').format("YYYYMMDDHH"));

  let collectionQuery = {
    dataType: req.query.dataType,
    timeStamp: {
      $gt: since,
      $lt: currentTime
    }
  };
  coll.find(collectionQuery).toArray((err, items) => {
    //class dataParser gives an attribute 'replacement' to replace the datasets in chart.html.
    let sampleParser = new dataParser(items, numOfAgents);
    //modify the html with the replacement string.
    fs.readFile('./modules/dashboard.html', 'utf-8', function (err, data) {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      //change the data of the area chart to be displayed.
      var result = data.replace('"{{ Area Chart Data }}"', sampleParser.dataByTime);

      //change the data of the pie chart to be displayed
      var result = result.replace('"{{ Pie Chart Data }}"', sampleParser.dataByAgents);

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

//app error config - if all routings above don't work then direct the visitor to the error page.
app.use((req, res) => {
  res.type('text/plain');
  res.send('Error page');
});

//let the app listen.
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});