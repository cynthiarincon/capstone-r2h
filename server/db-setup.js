// run this file ONCE to create all my database tables on AWS RDS
// command to run: node db-setup.js
// I connect without a database name first so I can create it

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const setup = async () => {

  // connect to RDS without specifying a database yet
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })

  try {

    // create the database if it doesnt already exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS explore_colombia`)
    console.log('database created or already exists!')

    // switch to using explore_colombia
    await connection.query(`USE explore_colombia`)

    // ===== USERS TABLE =====
    // stores basic login info for everyone -- users and hosts
    // role tells us if this account is a regular user or a host
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'host') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('users table created!')

    // ===== HOSTS TABLE =====
    // stores extra info only hosts need -- business name, department, bio
    // user_id connects this row back to the users table
    // this is called a foreign key -- it links two tables together
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hosts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        business_name VARCHAR(255),
        department VARCHAR(255),
        bio TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)
    console.log('hosts table created!')

    // ===== LISTINGS TABLE =====
    // stores experience listings created by hosts
    // host_id connects each listing back to the host who created it
    await connection.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        host_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        region VARCHAR(255),
        price VARCHAR(100),
        duration VARCHAR(100),
        contact VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (host_id) REFERENCES users(id)
      )
    `)
    console.log('listings table created!')

    // ===== TRIPS TABLE =====
    // stores AI generated itineraries that users save
    // user_id connects each trip back to the user who saved it
    await connection.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        region VARCHAR(255),
        duration VARCHAR(255),
        style VARCHAR(255),
        travel_group VARCHAR(255),
        itinerary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)
    console.log('trips table created!')

    // ===== BOOKMARKS TABLE =====
    // stores listings that users have bookmarked from the explore page
    // user_id and listing_id connect back to their tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        listing_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (listing_id) REFERENCES listings(id)
      )
    `)
    console.log('bookmarks table created!')

    console.log('all tables created successfully!')
    process.exit(0)

  } catch (err) {
    console.error('something went wrong:', err)
    process.exit(1)
  } finally {
    // always close the connection when done
    await connection.end()
  }
}

setup()