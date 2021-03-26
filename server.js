//variables required from DB
const secrets = require('./secrets')
const MongoClient = require('mongodb').MongoClient
const uri = secrets.uri
const client = new MongoClient(uri, { useNewUrlParser: true })
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


//client on connect -> DB
client.connect(err => {
	const collection = client.db("ips").collection("tags")
	// perform actions on the collection object
	client.close();
});

//DB schemas
var Tag = require('./static/models/tag.js');
var Coords = require('./static/models/coordinates.js');
var Anchor = require('./static/models/anchor.js');

//connect to MongoDB
mongoose.connect(uri, {
	useCreateIndex : true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverSelectionTimeoutMS: 5000
}).catch(err => console.log(err.reason));

const db = mongoose.connection;
//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

//stating up HTTP server

// const requestListener = function (req, res) {
//   res.writeHead(200);
//   res.end('Hello, World!')
// }
// const server = http.createServer(requestListener);

//express.js framework
const express = require('express')
const app = express()
app.set('view engine', 'ejs');

//starting up http server + socket.io conn
const httpPort = secrets.httpPort
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
io.on('connection', () => { /* … */ });
server.listen(httpPort);

//application port
const port = secrets.port
app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`)
})

// serve static files from template
const path = require("path");
app.use(express.static(path.join(__dirname, "/static")));

// //QR code generation 
// const QRcode = require("qrcode.js")

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

//main route
app.get('/', (req, res) => {
	res.render("index");
});

app.get('/admin/tag', (req, res) => {
	// UUID - STM32F103xx documentation, стр. 1075, 30.2, device electronic signature
	// console.log(req.query.taguid);
	res.render("tag", { id : req.query.taguid });
});

app.post('/admin/tag', (req, res) => {
	console.log(req.body)

	if(req.body.tagid && req.body.name) {
		var data = {
			name: req.body.name,
			tagID: req.body.tagid
		}

		Tag.findOne(({"tagID": data.tagID}), function (err, existing_tag) {
			if(err) {
				console.log(err);
			}
			if(existing_tag == null) {
				console.log('Creating tag...')
				Tag.create(data, function (error, tag) {
					if (error) {
						return next(error);
					} else {
						console.log("Created board - TAG - UID: " + req.body.tagid)
						return res.redirect('/admin');
					}
				}
			)}
			else {
				console.log("There is an exiting tag with the following UID: " + req.body.tagid)
				//TODO alert user there is such tagid 
			}
		})
	}
})


app.get('/admin', (req, res, next) => {
	// console.log("hey")
	return 200;
})



app.get('/ranging', (req, res, next) => {
	let lon = req.body.lon
	let lat = req.body.lat

	var data = {
		tagID: '0x668FF555353292929229',
		anchorID: '0x668FF555353667267241437',
		position: {
			coordinates: [[lon, lat], [lon, lat]]
			// {
			// 	lon: lon, 
			// 	lat: lat
			// }
		}
	}

	Coords.findOne(({"anchorID" : data.anchorID}, {"tagID" : data.tagID}, function (err, conn) {
		if(err) {
			console.log(err);
		} 
		else if(conn == null) {
			Coords.create(data, function (error, tag) {
				if (error) {
					return next(error);
				} else {
					return res.redirect('/');
				}
			})
		}
		else {
			// console.log(conn.position.coordinates[3][1])
			console.log(conn.position.type + conn.anchorID.type)
			var coords = [lon, lat]
			// {
			// 	lon: 7,
			// 	lat: 12
			// }

			Coords.updateOne(conn, 
				{ $push: 
					{ "position.coordinates": coords
						// }
					}
				}, function(error) {
					if(error){
						console.log(error);
					}
				} 
			)
			console.log("pushed")
			return res.redirect('/');
		}
	}))
})

app.get('/admin/anchor', (req, res, next) => { 
	res.render("configuration-panel" , { id : req.query.taguid })
})

app.post('/admin/anchor', (req, res, next) => {
	// console.log(req.body)
	// let lon = req.body.long;
	// let lat = req.body.lat;
	let id = req.query.anchorid;

	// var data = {
	// 	anchorID: id,
	// 	position: {  
	// 		type: 'Point', 
	// 		coordinates: [lon, lat]
	// 	}
	// }
	
	// Anchor.findOne({"anchorID" : id}, function (err, anchor) {
	// 	if(err) {
	// 		console.log(err);
	// 	} 
	// 	else if(anchor == null) {
	// 		Anchor.create(data, function (error, anchor) {
	// 			if (error) {
	// 				return next(error);
	// 			} else {
	// 				return res.redirect('/');
	// 			}
	// 		})
	// 	}
	// 	else {
	// 		console.log("There is already an anchor with the following UID: " + id);
	// 		return res.redirect('/configuration');
	// 	}
	// });
})

//QR code generation route
app.get('/generate_QR', (req, res) => {
	res.render("qr_generation")
});

// io.on('generateQR', (address) => {
//   console.log(text)
// })
