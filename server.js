var http = require("http"),
		fs = require("fs"),
		qs = require("querystring"),
		mongodb = require("mongodb"),
		MongoClient = require("mongodb").MongoClient,
		docs = [],
		loginUser = "",
		loginPassword = "",
		loginSuccessful = false,
		mongodbServer = new mongodb.Server("localhost", 27017, { auto_reconnect: true, poolSize: 10 }),
		db = new mongodb.Db("QSdb", mongodbServer),
		url = "mongodb://localhost:27017/QSdb", // Connect DB
		ports = 5001; //Ports

var server = http.createServer(function(request, response) 
{
	if (request.method == "POST") 
	{
		var formData = "", 
				msg = "", 
				obj = "",
				favMsg = "", 
				favObj = "";
		return request.on("data", function(data)
		{
			formData += data;
		}).on('end', function(chunk) 
		{
			// user array - users name, password, action
			var user;
			user = qs.parse(formData);
			msg = JSON.stringify(user);
			obj = JSON.parse(msg);
			
			// fav array - fav name, address, phone
			var fav;
			fav = qs.parse(formData);
			favMsg = JSON.stringify(fav);
			favObj = JSON.parse(favMsg);
			
			if(favObj.act==="postFavourite")
			{
				MongoClient.connect(url, function (err, db) 
				{
					db.collection("fav2", function (err, data) 
					{
						data.find().toArray(function(err, items) 
						{
							if(err) throw err;
							console.log(items.length);
							console.log(items);
							if (items !== "") 
							{
								response.end(JSON.stringify(items)); // Post name, address, phone number into Json
							}
						});
					});
				});
			} else if(favObj.act==="addFavourite")
			{

				db.open(function() 
				{
					var myquery = {name : favObj.name, address : favObj.address, phone : favObj.phone};

					db.collection("fav2").insertOne(myquery, function(err, data) 
					{
						if (data) 
						{
								console.log("Successfully Insert");
								response.end(favObj.name); // Add name, address, phone number
						} else 
						{
								console.log("Failed to Insert");
						}
        	});
					db.close();
				});		
			} else if(favObj.act==="removeFavourite")
			{
				console.log("Delete start");
				var myquery = {name: favObj.name};
				console.log(myquery);
				db.open(function() 
				{
					db.collection("fav2").deleteOne(myquery, function(err, data) // detect fav name delete item
					{
						console.log("Delete done");
						db.close();
        	});
					console.log("Delete end");
				});		
			} else if(obj.act==="register")
			{
				db.open(function() 
				{
					docs.push({"username" : obj.ac, "password" : obj.pw}) // Push user name and password into user array
					docs.forEach(function(item,index)
					{
							for(var prop in item) 
							{ 
									if (prop.match(/_id/) !== null) { delete item[prop]; }
							}
					});	
					db.collection("user").insertMany(docs, function(err, data) // Insert user array to db
					{
						if (data) 
						{
								console.log("Successfully Insert");
								response.end('Successfully Register');
						} else 
						{
								console.log("Failed to Insert");
						}
        	});
					db.close();
				});
			} else if(obj.act==="logout")
			{
				console.log("LOGOUT OK");
				response.end('Logout');
			} else if(obj.act==="login")
			{
				var username = obj.ac;
				var password = obj.pw;	
				MongoClient.connect(url, function (err, db) 
				{
					db.collection("user", function (err, data) 
					{
						data.find().toArray(function(err, items) 
						{
							if(err) throw err;
							console.log(items.length);
							if (items !== "") 
							{
								for (var i=0; i<items.length; i++) 
								{
									if (items[i].username == obj.ac && items[i].password == obj.pw) // if login input user name and password same before register save server server name and password
									{
										loginUser = items[i].username;
										loginPassword = items[i].password
										console.log("user="+loginUser);
										console.log("pass="+loginPassword);
										loginSuccessful = true;
									}
								}
								if(loginSuccessful === false)
								{
									console.log("Fail to login");
									response.end('fail');
								}else
								{
									loginSuccessful = false;
									console.log("LOGIN OK");
									response.end(obj.ac);
								}
							}
						});
					});
				});
			}
			
		});
	} else
	{	
		fs.readFile("./" + request.url, function (err, data) {
			var dotoffset = request.url.lastIndexOf(".");		
			var mimetype = dotoffset == -1 ? "text/plain"
				: {
					".html": "text/html",
					".css" : "text/css",
					".js"  : "text/javascript",
					".ico" : "image/x-icon",
					".jpg" : "image/jpeg",
					".png" : "image/png",
					".gif" : "image/gif"
				}[request.url.substr(dotoffset)];
			if (!err) {
				response.setHeader("Content-Type", mimetype);
				response.end(data);
				//console.log(request.url, mimetype);
			} else {
				response.writeHead(302, {"Location": "./index.html"});
				response.end();
			}
		});
		
	}
});
server.listen(ports);
console.log("Server Ports "+ports);