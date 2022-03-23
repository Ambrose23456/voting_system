const mysql = require('mysql2')

const connection = mysql.createPool({
  host: "mysql-73202-0.cloudclusters.net",
  user: "admin",
  password: "o2y8uPjw",
  database: "bincom_test"
})
 
// connection.connect()

const db = connection.promise()


module.exports = db