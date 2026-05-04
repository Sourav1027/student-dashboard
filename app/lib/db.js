// import mysql from "mysql2/promise";

// const db = mysql.createPool({
//   host: "localhost", 
//   user: "root",
//   password: "",     
//   database: "my_test",
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// export default db;


import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "216.10.253.53", 
  user: "interejr_admin_card",
  password: "interejr_admin_card",     
  database: "interejr_admin_card",
  waitForConnections: true,
  connectionLimit: 100,
});

export default db;