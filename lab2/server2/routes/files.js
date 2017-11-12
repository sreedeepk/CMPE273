const mysql = require("./mysql")
const crypto = require('crypto');
const _ = require('lodash');

function upload(req, res) {
	if(req.files[0]) {
		const file= req.files[0];
		const email = req.user.email;
		console.log(req.files[0])
		const file_name = req.files[0].originalname;
		const path = req.files[0].path;

		let query = "select * from users where email=" + mysql.escape(email)
		
		console.log(query);
	
		mysql.pool.query(query, function (error, results, fields) {
			if (error) {
				res.send(500, error.message)
			} else{
				if(results[0]) {
					const user_id = results[0].user_id
					let query = "insert into files(user_id, file_name, path) values(" + mysql.escape(user_id) + "," + mysql.escape(file_name) + "," + mysql.escape(path) + ")"

					console.log(query);
					mysql.pool.query(query, function (error, results, fields) {
						if (error) {
							res.send(500, error.message)
						} else {
							if(results["insertId"]) {
								res.send(200, "File uploaded successfully, id: " + results["insertId"])
							} else {
								res.send(200, "Unable to create new file");
							}
						}
					})
				}
			}
		})
	}
}

function getFilesList(req, res) {
	const email = req.user.email;
	let query = "select * from users where email=" + mysql.escape(email)

	console.log(query);
	
	mysql.pool.query(query, function (error, results, fields) {
		if (error) {
			res.send(500, error.message)
		} else{
			if(results[0]) {
				const user_id = results[0].user_id
				let query = "select * from files where user_id = " + mysql.escape(user_id)
				
				console.log(query);

				var filesList = []
				
				mysql.pool.query(query, function (error, results, fields) {
					var arrayLength = results.length;
					for (var i = 0; i < arrayLength; i++) {
						console.log(results[i])
						console.log("=======")
						let data = {}
						data["file_id"] = results[i].file_id
						data["file_name"] = results[i].file_name
						console.log(data)
						filesList.push(data)
						console.log(filesList)
					}
					res.send(200,filesList)					
				})
			}
			else {
				res.send(200, [])
			}
		}
	})
}

function getFile(req, res, id) {
	const email = req.user.email;
	console.log("id: " + id)
	let query = "select * from users where email=" + mysql.escape(email)

	console.log(query);
	
	mysql.pool.query(query, function (error, results, fields) {
		if (error) {
			res.send(500, error.message)
		} else{
			if(results[0]) {
				const user_id = results[0].user_id
				let query = "select * from files where user_id = " + mysql.escape(user_id) + " and file_id = " + mysql.escape(id)
				
				console.log(query);

				var data = {}
				
				mysql.pool.query(query, function (error, results, fields) {
					var arrayLength = results.length;
					for (var i = 0; i < arrayLength; i++) {
						data["file_id"] = results[i].file_id
						data["file_name"] = results[i].file_name
					}
					res.send(200,data)
				})
			}
			else {
				res.send(200, {})
			}
		}
	})
}

exports.upload = upload;
exports.getFile = getFile;
exports.getFilesList = getFilesList;