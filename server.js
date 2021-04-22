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
let Coords = require('./static/models/coordinates.js');
let Anchor = require('./static/models/anchor.js');
let Admin = require('./static/models/admin.js');
let User = require('./static/models/user.js');
let Map = require('./static/models/map.js');
let Tag = require('./static/models/tag.js');

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
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));


//cookies
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// app.use(cookieParser(config.cookieSecret))

// //QR code generation 
// const QRcode = require("qrcode.js")

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//JWT token
const jwt = require('jsonwebtoken');

function generateAccessToken(username) {
	console.log("generating token")
  return jwt.sign(username, secrets.secret, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
  // const authHeader = req.headers['authorization']
  // const token = authHeader && authHeader.split(' ')[1]
	// console.log(req.cookies)
	// console.log(req.headers)

	const token = req.cookies.token || '';
  if (token == null) return res.sendStatus(401).json('You need to login');

  jwt.verify(token, secrets.secret, (err, user) => {
		
		if (err) {
			console.log(err)
			return res.sendStatus(403)
		}
		
		// req.user = {
    //   id: decrypt.id,
    //   firstname: decrypt.firstname,
    // };
    req.user = user;
		console.log("authenticated")
    next()
  })
}
// const token = generateAccessToken({ username: req.body.username });
// res.json(token);
// userside
// // get token from fetch request
// const token = await res.json();
// // set token in cookie
// document.cookie = `token=${token}`

//main route
app.get('/', (req, res) => {
	res.render("index");
});

app.get('/admin', authenticateToken, (req, res, next) => {
	res.render("admin", { name: "Jamie"});
})

app.get('/admin/auth', (req, res, next) => {
	res.render("admin_login", { name: "Jamie"});
})

app.post('/admin/auth', (req, res, next) => {
	if (req.body.email && req.body.password) {
    Admin.authenticate(req.body.email, req.body.password, function (error, admin) {
      if (error || !admin) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
				let token = generateAccessToken({ username: admin.name });

				let auth = 'Bearer ' + token;
				res.header('Authorization', auth);

				res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 })
				// return res.cookie('token', token, {
				// 	expires: new Date(Date.now() + expiration),
				// 	secure: false, // set to true if your using https
				// 	httpOnly: true,
				// });

        return res.render("admin", { token: token, name: admin.name});
				// res.redirect('/admin')
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})


app.get('/admin/tag', authenticateToken, (req, res) => {
	// UUID - STM32F103xx documentation, стр. 1075, 30.2, device electronic signature
	// console.log(req.query.taguid);
	res.render("tag", { id : req.query.taguid });
});

app.post('/admin/tag', authenticateToken, (req, res) => {
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



app.get('/admin/add', (req, res) => {
	Admin.find().exec(function (error, admins) {
		if(error){
			console.log(error);
		}
		else{
			res.render("add_admin", {admins: admins});
		}
	});
});

app.post('/admin/add', (req, res) => { 
	// TODO main admin add main admins
	//TODO check if values are ok

	let data = {
		name: req.body.name, 
		surname: req.body.surname,
		email: req.body.email,
		phone: req.body.phone,
		password: req.body.password,
		main_admin: false
	}

	Admin.create(data, function (error, admin) {
		if (error) {
			return error;
		} else {
			return res.redirect('/admin/add');
		}
	})

});

app.get('/admin/maps', authenticateToken, (req, res) => {
	Map.find().exec(function (error, maps) {
		if(error) {
			console.log(error);
		}
		else {
			res.render("maps", {maps: maps});
		}
	});
})

app.post('/admin/maps', authenticateToken, (req, res) => {
	if (req.body.fileinput != null && req.body.fileinput != "") {
		var file = JSON.parse(req.body.fileinput);

		console.log(req.body.width + " " + req.body.height)

		if (file != null) { //mime type check omitted
			var data = {
				date: new Date(),
				file: file.data,
				fileType: file.type,
				fileName: file.name,
				height: req.body.height,
				width: req.body.width,
				active: false
			}

			if(req.body.activemap == "1") {
				data.active = true;

				Map.updateMany({active: true}, {$set: {active: false}}, (err, writeResult) => {});
			}

			Map.create(data, function (error, map) {
				if (error) {
					return next(error);
				} else {
					return res.redirect('/');
				}
			})
		}
	}
})

app.get('/admin/tags', authenticateToken, (req, res) => {
	Tag.find().exec(function (error, tags) {
		if(error) {
			console.log(error);
		}
		else {
			res.render("manage-tags", {tags: tags});
		}
	});
})

app.get('/admin/anchors', authenticateToken, (req, res) => {
	Anchor.find().exec(function (error, anchors) {
		if(error) {
			console.log(error);
		}
		else {
			res.render("manage-anchors", {anchors: anchors});
		}
	});
})

app.get('/ranging', (req, res, next) => {
	// let lon = req.body.lon
	// let lat = req.body.lat
	let lon = 216
	let lat = -102.5

	let data = {
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

app.get('/admin/anchor', authenticateToken, (req, res, next) => { 
	Map.findOne({active: true}, function (error, map) {
		if(error) {
			console.log(error);
		}
		else {
			res.render("anchor" , { id : req.query.taguid, map: map})
		}
	});
})

app.post('/admin/anchor', authenticateToken, (req, res, next) => {
	// console.log(req.body)
	let lon = req.body.lon;
	let lat = req.body.lat;
	let id = req.body.anchorid;

	var data = {
		anchorID: id,
		position: {  
			type: 'Point', 
			coordinates: [lon, lat]
		}
	}
	
	Anchor.findOne({"anchorID" : id}, function (err, anchor) {
		if(err) {
			console.log(err);
		} 
		//TODO check in tags too and inform user
		else if(anchor == null) {
			Anchor.create(data, function (error, anchor) {
				if (error) {
					return next(error);
				} else {
					return res.redirect('/admin');
				}
			})
		}
		else {
			console.log("There is already an anchor with the following UID: " + id);
			//TODO show it 
			//TODO say if undefined/not on
			return res.redirect('/admin'); //TODO
		}
	});
})

//QR code generation route
app.get('/admin/generate_QR', authenticateToken, (req, res) => {
	res.render("qr_generation");
});



// io.on('generateQR', (address) => {
//   console.log(text)
// })
