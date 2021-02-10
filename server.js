//variables required from DB
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://iliana:<password>@ips.ykhnr.mongodb.net/<dbname>?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true })

//client on connect -> DB
client.connect(err => {
  const collection = client.db("test").collection("devices")
  // perform actions on the collection object
  client.close();
});

//stating up HTTP server

// const requestListener = function (req, res) {
//   res.writeHead(200);
//   res.end('Hello, World!')
// }
// const server = http.createServer(requestListener);

//DB schemas
var User = require('./static/models/user.js');

//express.js framework
const express = require('express')
const app = express()
app.set('view engine', 'ejs');

//starting up http server + socket.io conn
const httpPort = 3000;
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
io.on('connection', () => { /* … */ });
server.listen(httpPort);

//application port
const port = 8080
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

// serve static files from template
const path = require("path");
app.use(express.static(path.join(__dirname, "/static")));

// //QR code generation 
// const QRcode = require("qrcode.js")

//main route
app.get('/', (req, res) => {
  // UUID - STM32F103xx documentation shorturl.at/kELX3
  // стр. 1075, 30.2, device electronic signature
  console.log(req.query.taguid);
  res.render("index", { id : req.query.taguid });
});

//QR code generation route
app.get('/generate_QR', (req, res) => {
	res.render("qr_generation")
});

// io.on('generateQR', (address) => {
//   console.log(text)
// })
