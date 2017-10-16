const mysql = require("./mysql")
const crypto = require('crypto');

function create(req, res) {
	console.log(req.body)
	const email = req.user.email;
	const name = req.body.name;

	let query = "select * from users where email=" + mysql.escape(email)

	console.log(query);

	mysql.pool.query(query, function (error, results, fields) {
		if (error) {
			res.send(500, error.message)
		} else{
			if(results[0]) {
				const user_id = results[0].user_id
				let query = "insert into groups(group_name, owner_id) values(" + mysql.escape(name) + ", " + mysql.escape(user_id) + ")"
				console.log(query);
				mysql.pool.query(query, function (error, results, fields) {
					if (error) {
						res.send(500, error.message)
					} else {
						console.log(results)
						if(results["insertId"]) {
							const group_id = results["insertId"]
							let query = "insert into group_members(group_id, user_id) values(" + mysql.escape(group_id) + ", " + mysql.escape(user_id) + ")"
							mysql.pool.query(query, function (error, results, fields) {
								if (error) {
									res.send(500, error.message)
								}
							})
							res.send(200, "New group created, id: " + group_id);
						} else{
							res.send(200, "Unable to create new group");
						}
					}
				});
			} else{
				res.send(400, "Invalid user");
			}
		}
	});
}

function addMembers(req, res) {
	console.assert(false);
}

function showMembers(req, res) {
	console.assert(false);
}

function deleteMembers(req, res) {
	console.assert(false);
}

function deleteGroup(req, res) {
	console.assert(false);
}

exports.create = create;
exports.addMembers = addMembers;
exports.showMembers = showMembers;
exports.deleteMembers = deleteMembers;
exports.deleteGroup = deleteGroup;