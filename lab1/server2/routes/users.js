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
				res.send(200, "New user created, id: " + results["insertId"]);
			} else{
				res.send(200, "Unable to insert new user");
			}
		}
	});
}

function signin(req, res) {
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

exports.signup = signup;
exports.signin = signin;
exports.signout = signout;