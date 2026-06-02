// opens a connection to requests database

import mysql from "mysql2/promise";

export default mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "requests",
});