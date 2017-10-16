const mysql = require("./mysql")
const crypto = require('crypto');

function signup(req, res) {
	const email = req.body.email;
	const password = req.body.password;
	const first_name = req.body.first_name;
	const last_name = req.body.last_name;

	if(!password)
	{
		res.send(400, "undefined or empty password")
	}

	let hash = crypto.createHash('sha256').update(password).digest('base64');

	let query = "insert into users(email, password, first_name, last_name) values(" + mysql.escape(email) + "," + mysql.escape(hash) + "," + mysql.escape(first_name) + "," + mysql.escape(last_name) + ")"

	console.log(query);

	mysql.pool.query(query, function (error, results, fields) {
		if (error) {
			res.send(500, error.message)
		} else{
			if(results["insertId"]) {
				const user_id = results["insertId"]
				const work = req.body.work;
				const overview = req.body.overview;
				const interests = req.body.interests;
				let query = "insert into users_info(user_id, work, overview, interests) values(" + mysql.escape(user_id) + "," + mysql.escape(work) + "," + mysql.escape(overview) + "," + mysql.escape(interests) + ")"

				console.log(query)

				mysql.pool.query(query, function (error, results, fields) {
				})

				res.send(200, "New user created, id: " + user_id);
			} else{
				res.send(200, "Unable to insert new user");
			}
		}
	});
}

function signin(req, res) {
	console.log(req.body);
	const email = req.body.email;
	const password = req.body.password;

	if(!password)
	{
		res.send(400, "undefined or empty password")
	}

	let hash = crypto.createHash('sha256').update(password).digest('base64');

	let query = "select * from users where email = " + mysql.escape(email) + " and password=" + mysql.escape(hash)

	console.log(query);

	mysql.pool.query(query, function (error, results, fields) {
		if (error) {
			res.send(500, error.message)
		} else{
			console.log(results)
			if(results[0] ) {
				req.session.user = results[0];
				res.send(200, "login successful");
			} else{
				res.send(401, "Unable to login");
			}
		}
	});
}

function signout(req, res) {
	req.session.reset();
	res.send(200, "logout successful");
}

function info(req, res) {
	const email = req.user.email;
	let query = "select * from users where email=" + mysql.escape(email)

	console.log(query);
	
	mysql.pool.query(query, function (error, results, fields) {
		if (error) {
			res.send(500, error.message)
		} else{
			if(results[0]) {
				const user_id = results[0].user_id
				let query = "select * from users_info where user_id = " + mysql.escape(user_id)
				
				console.log(query);

				var data = {}
				
				mysql.pool.query(query, function (error, results, fields) {
					if (error) {
						res.send(500, error.message)
					} else{
						if(results[0]) {
							res.send(200,results[0])
						} else {
							res.send(200,data)
						}
					}
				})
			}
			else {
				res.send(200, {})
			}
		}
	})
}

exports.signup = signup;
exports.signin = signin;
exports.signout = signout;
exports.info = info;