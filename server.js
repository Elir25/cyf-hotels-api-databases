const express = require("express");
const app = express();

const { Pool } = require('pg');
//to keep password saved
const secret = require("./secret.json")
//using body parser 
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const pool = new Pool(secret);

app.get("/hotels", function(req, res) {
    pool.query('SELECT * FROM hotels', (error, result) => {
        res.json(result.rows);
    });
});

app.get("/hello", function (req, res) {
    res.send("Hello!!");
  });

  app.get("/customers", function (req, res){
    pool.query('SELECT * FROM customers', (error, result) => {
        res.json(result.rows);
    });
  });

//creating data week 3 inclass

/*  POST andpoint to create a new hotel   */
  app.post("/hotels", function (req, res) {
    const newHotelName = req.body.name;
    const newHotelRooms = req.body.rooms;
    const newHotelPostcode = req.body.postcode;
  
    if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
        return res
          .status(400)
          .send("The number of rooms should be a positive integer.");
      }
    
    const query =
      "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3) returning id as hotelId";
  
    pool
      .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
      .then((result2) => res.json(result2.rows[0]))
      .catch((e) => console.error(e));
  });
/**POST -- create a new endpoint that creates a new customer */
app.post("/customers", function (req, res) {
  const newCustomerName = req.body.name;
  const newCustomerEmail = req.body.email;
  const newCustomerAddress = req.body.address;
  const newCustomerCity = req.body.city;
  const newCustomerPostcode = req.body.postcode;
  const newCustomerCountry = req.body.country;
  
  const query =
    "INSERT INTO customers (name, email, address, city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6) returning id as CustomerId";
  pool
    .query(query, [newCustomerName, newCustomerEmail, newCustomerAddress, newCustomerCity, newCustomerPostcode, newCustomerCountry])
    .then((result2) => res.json(result2.rows[0]))
    .catch((e) => console.error(e));
});
//get a hotel by an id
  app.get("/hotels/:hotelId", function (req, res) {
    const hotelId = req.params.hotelId;
  
    pool
      .query("SELECT * FROM hotels WHERE id=$1", [hotelId])
      .then((result) => res.json(result.rows[0]))
      .catch((e) => console.error(e));
  });

//get a hotel by name -- i need to fix and finish this one 
  app.get("/hotels/:hotelName", function (req, res) {
    const hotelName = req.params.hotelName;
  
    pool
      .query("SELECT * FROM hotels WHERE hotels.name=$Jade Peaks Hotel", [hotelName])
      .then((result) => res.json(result.rows))
      .catch((e) => console.error(e));
  });
//update all the data --PUT
  app.get("/hotels/:hotelId", function (req, res) {
    const hotelId = req.params.hotelId;
  
    pool
      .query("SELECT * FROM hotels WHERE id=$1", [hotelId])
      .then((result) => res.json(result.rows))
      .catch((e) => console.error(e));
  });

app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});