import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost", 
  user: "root",
  password: "",     
  database: "my_test",
  waitForConnections: true,
  connectionLimit: 10,
});

export default db;