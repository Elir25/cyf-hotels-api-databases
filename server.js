const express = require("express");
const app = express();

const { Pool } = require('pg');

const secret = require("./secret.json")
//using body parser 
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const pool = new Pool(secret);

// app.get("/hotels", function(req, res) {
//     pool.query('SELECT * FROM hotels', (error, result) => {
//         res.json(result.rows);
//     });
// });

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
  
  if (newCustomerName) {
    return res
      .status(400)
      .send("The customer name already exist");
  }

  const query =
    "INSERT INTO customers (name, email, address, city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6) returning id as CustomerId";
  pool
    .query(query, [newCustomerName, newCustomerEmail, newCustomerAddress, newCustomerCity, newCustomerPostcode, newCustomerCountry])
    .then((result2) => res.json(result2.rows[0]))
    .catch((e) => console.error(e));
});

/**EX 2.1 WEEK 3 GET hotel by id */
  app.get("/hotels/:hotelId", function (req, res) {
    const hotelId = req.params.hotelId;
  
    pool
      .query("SELECT * FROM hotels WHERE id=$1", [hotelId])
      .then((result) => res.json(result.rows[0]))
      .catch((e) => console.error(e));
  });

/**EX 2.2 WEEK 3 GET Add a new GET endpoint /customers to load all customers ordered by name.*/

app.get("/customersOrderByName", function (req, res){
  pool.query('SELECT * FROM customers ORDER BY name ASC', (error, result) => {
      res.json(result.rows);
  });
});

/**EX 2.3- Add a new GET endpoint /customers/:customerId to load one customer by ID. */
app.get("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;

  pool
    .query("SELECT * FROM customers WHERE id=$1", [customerId])
    .then((result) => res.json(result.rows[0]))
    .catch((e) => console.error(e));
});

/**2.4 - Add a new GET endpoint /customers/:customerId/bookings to load all the bookings of a specific customer. 
 * Returns the following information: check in date, number of nights, hotel name, hotel postcode.*/
 app.get("/customers/:customerId/bookings", function (req, res) {
  const customerId = req.params.customerId;

  const query =
  "SELECT b.checkin_date, b.nights, h.name, h.postcode FROM customers c inner join bookings b ON c.id=b.customer_id INNER JOIN hotels h ON b.hotel_id=h.id WHERE c.id=$1;";
  pool
    .query(query, [customerId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

/*GET a hotel by name and Get the list of hotels if theres no query parameter */
  app.get("/hotels", function (req, res) {
    const hotelNameQuery = req.query.name;
    //const query = `SELECT * FROM hotels WHERE name = $1`;
    let query = 'SELECT * FROM hotels';
    
    if (hotelNameQuery) {
      // query = `SELECT * FROM hotels WHERE name = $1`;
      query = `SELECT * FROM hotels WHERE name = '${hotelNameQuery}'`
    }

    pool
      .query(query)
      .then((result) => res.json(result.rows))
      .catch((e) => console.error(e));
  });

/** 3.1 Add the PATCH endpoint /customers/:customerId and verify you can update a customer email using Postman. */
/**3.2 Add validation for the email before updating the customer record in the database. 
 * If the email is empty, return an error message.*/ //DONE

 /** 3.3 Add the possibility to also update the address, the city, the postcode and the country of a customer. 
  * Be aware that if you want to update the city only for example, the other fields should not be changed! */
app.patch("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  const newEmail = req.body.email;
  
  const newAddress = req.body.address;
  const newCity = req.body.city;
  const newPostcode = req.body.postcode;
  const newCountry = req.body.country;

  if (newEmail == "") {
    res.status(400).send("The email must not be empty");
  }
  
  if (newEmail) {
    pool
    .query("UPDATE customers SET email=$1 WHERE id=$2", [newEmail, customerId])
    .then(() => res.send(`Customer ${customerId} updated!`))
    .catch((e) => console.error(e));
  }
  
  if (newAddress) {
    pool
    .query("UPDATE customers SET address=$1 WHERE id=$2", [newAddress, customerId])
    .then(() => res.send(`Customer ${customerId} updated!`))
    .catch((e) => console.error(e));
  }

  if (newCity) {
    pool
    .query("UPDATE customers SET city=$1 WHERE id=$2", [newCity, customerId])
    .then(() => res.send(`Customer ${customerId} updated!`))
    .catch((e) => console.error(e));
  }

  if (newPostcode) {
    pool
    .query("UPDATE customers SET postcode=$1 WHERE id=$2", [newPostcode, customerId])
    .then(() => res.send(`Customer ${customerId} updated!`))
    .catch((e) => console.error(e));
  }

  if (newCountry) {
    pool
    .query("UPDATE customers SET country=$1 WHERE id=$2", [newCountry, customerId])
    .then(() => res.send(`Customer ${customerId} updated!`))
    .catch((e) => console.error(e));
  }
  
});


/**4 - Add the DELETE endpoint /customers/:customerId above and verify you can delete a customer along their bookings with Postman. */
app.delete("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;

  pool
    .query("DELETE FROM bookings WHERE customer_id=$1", [customerId])
    .then(() => {
      pool
        .query("DELETE FROM customers WHERE id=$1", [customerId])
        .then(() => res.send(`Customer ${customerId} deleted!`))
        .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));
});

/**Add a new DELETE endpoint /hotels/:hotelId to delete a specific hotel. 
 * A hotel can only be deleted if it doesn't appear in any of the customers' bookings! 
 * Make sure you add the corresponding validation before you try to delete a hotel. */
 app.delete("/hotels/:hotelId", function (req, res) {
  const hotelId = req.params.hotelId;


  pool
    .query("DELETE FROM bookings WHERE hotel_id=$1", [hotelId])
    .then(() => {
      pool
        .query("DELETE FROM hotels WHERE id=$1", [hotelId])
        .then(() => res.send(`Hotel ${hotelId} deleted!`))
        .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));
});

//update all the data --PUT
  // app.get("/hotels/:hotelId", function (req, res) {
  //   const hotelId = req.params.hotelId;
  
  //   pool
  //     .query("SELECT * FROM hotels WHERE id=$1", [hotelId])
  //     .then((result) => res.json(result.rows))
  //     .catch((e) => console.error(e));
  // });

app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});