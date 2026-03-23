// this file connects my app to the MySQL database on AWS RDS
// instead of making a new connection every time, I use a pool
// a pool keeps connections ready so the app runs faster
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

// load my .env variables so I can use process.env
dotenv.config()

// create a connection pool using my .env credentials
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // my RDS endpoint
  user: process.env.DB_USER,       // admin
  password: process.env.DB_PASSWORD, // my RDS password
  database: process.env.DB_NAME,   // explore_colombia
  waitForConnections: true,        // wait if all connections are busy
  connectionLimit: 10,             // max 10 connections at once
})

export default pool