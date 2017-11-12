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
	const email = req.user.email;
	const member_email = req.body.email;
	const group_id = parseInt(req.params.id);

	let query = "select * from users u inner join groups g on u.user_id = g.owner_id and u.email=" + mysql.escape(email) + " and g.group_id=" + mysql.escape(group_id)
	console.log(query);
	mysql.pool.query(query, function (error, results, fields) {
		if (error) {
			res.send(500, error.message)
		} else{
			if(results[0]) {
				let query = "select * from users where email=" + mysql.escape(member_email)
				console.log(query);

				mysql.pool.query(query, function (error, results, fields) {
					if (error) {
						res.send(500, error.message)
					} else{
						if(results[0]) {
							const member_id = results[0].user_id
							let query = "insert into group_members(group_id, user_id) values( " + mysql.escape(group_id) + " , " + mysql.escape(member_id) +" )"
							console.log(query);

							mysql.pool.query(query, function (error, results, fields) {
								if (error) {
									res.send(500, error.message)
								} else{
									res.send(200, "Member inserted into the group")
								}
							})
						} else {
							res.send(400, "Invalid user");
						}
					}
				})
			} else{
				res.send(403, "Access Denied");
			}
		}
	})
}

function showMembers(req, res) {
	const email = req.user.email;
	const group_id = parseInt(req.params.id);

	let query = "select * from users u inner join groups g on u.user_id = g.owner_id and u.email=" + mysql.escape(email) + " and g.group_id=" + mysql.escape(group_id)
	console.log(query);
	mysql.pool.query(query, function (error, results, fields) {
		if (error) {
			res.send(500, error.message)
		} else{
			if(results[0]) {
				let query = "select * from group_members g inner join users u on g.user_id = u.user_id and g.group_id =" + mysql.escape(group_id)
				console.log(query);

				mysql.pool.query(query, function (error, results, fields) {
					if (error) {
						res.send(500, error.message)
					} else{
						if(results[0]) {
							var userList = []
							var arrayLength = results.length;
							for (var i = 0; i < arrayLength; i++) {
								console.log(results[i])
								console.log("=======")
								userList.push(results[i].email)
								console.log(userList)
							}
							res.send(200,userList)
						} else {
							res.send(200,[])
						}
					}
				})
			} else{
				res.send(403, "Access Denied");
			}
		}
	})
}

function deleteMembers(req, res) {
	const email = req.user.email;
	const group_id = parseInt(req.params.id);

	let query = "select * from users u inner join groups g on u.user_id = g.owner_id and u.email=" + mysql.escape(email) + " and g.group_id=" + mysql.escape(group_id)
	console.log(query);
	mysql.pool.query(query, function (error, results, fields) {
		if (error) {
			res.send(500, error.message)
		} else{
			if(results[0]) {
				let query = "delete from group_members where group_id =" + mysql.escape(group_id) + " and user_id != " + mysql.escape(results[0].user_id)
				console.log(query);

				mysql.pool.query(query, function (error, results, fields) {
					if (error) {
						res.send(500, error.message)
					} else{
						res.send(200,"Deleted members from the group")
					}
				})
			} else{
				res.send(403, "Access Denied");
			}
		}
	})
}

function deleteGroup(req, res) {
	const email = req.user.email;
	const group_id = parseInt(req.params.id);

	let query = "select * from users u inner join groups g on u.user_id = g.owner_id and u.email=" + mysql.escape(email) + " and g.group_id=" + mysql.escape(group_id)
	console.log(query);
	mysql.pool.query(query, function (error, results, fields) {
		if (error) {
			res.send(500, error.message)
		} else{
			if(results[0]) {
				let query = "delete from group_members where group_id =" + mysql.escape(group_id)
				console.log(query);

				mysql.pool.query(query, function (error, results, fields) {
					if (error) {
						res.send(500, error.message)
					} else{
						let query = "delete from groups where group_id =" + mysql.escape(group_id)
						mysql.pool.query(query, function (error, results, fields) {
							if (error) {
								res.send(500, error.message)
							} else{
								res.send(200,"Deleted the group")
							}
						});
					}
				})
			} else{
				res.send(403, "Access Denied");
			}
		}
	})
}

exports.create = create;
exports.addMembers = addMembers;
exports.showMembers = showMembers;
exports.deleteMembers = deleteMembers;
exports.deleteGroup = deleteGroup;