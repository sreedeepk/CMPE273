const mysql = require("./mysql")

function signin(req, res) {
	mysql.fetchDataFromPool(console.log, "show tables;");
}

exports.signin = signin;