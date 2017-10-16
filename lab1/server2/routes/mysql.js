const mysql = require('mysql');

const host = 'localhost'
const user = 'root'
const password = 'root'
const database = 'cmpe273'
const port = 3306

//Put your mysql configuration settings - user, password, database and port
function getConnection(){
	var connection = mysql.createConnection({
	    host     : host,
	    user     : user,
	    password : password,
	    database : database,
	    port	 : port
	});
	return connection;
}

const pool = mysql.createPool({
	connectionLimit : 10,
	    host     : host,
	    user     : user,
	    password : password,
	    database : database,
	    port	 : port
});


function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}

function fetchDataFromPool(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	pool.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
}

exports.fetchData=fetchData;
exports.fetchDataFromPool=fetchDataFromPool;
exports.escape=mysql.escape;
exports.pool=pool;
exports.getConnection=getConnection;