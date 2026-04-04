const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",         
  password: "1234567890",
  database: "snoc_db"   
});

db.connect((err) => {
  if (err) {
    console.error("DB Connection Failed:", err);
  } else {
    console.log("snoc_db Connected successfully");
  }
});

module.exports = db;