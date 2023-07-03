const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyTokenMiddleware = require("./verifyTokenMiddleware");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());
const corsConfig = {
  origin: "",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));

const uri =
  "mongodb+srv://dbUser:ASd2C66WzvIp0e9r@fristusemongodb.yjaddi5.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const OrderCollection = client.db("Platinumys").collection("All Orders");
    const userCollection = client.db("Platinumys").collection("userCollection");
    const customerCollection = client
      .db("Platinumys")
      .collection("customerCollection");
    const officeOrderCollection = client
      .db("Platinumys")
      .collection("OrderFromOffice");

    // Middleware for parsing JSON data
    app.use(express.json());

    //Export Collection
    module.exports = {
      OrderCollection,
      userCollection,
      officeOrderCollection,
      customerCollection,
    };

    // Routes
    const userRoutes = require("./modules/users/user.routes");
    app.use("/user", userRoutes);

    const orderRoutes = require("./modules/order/order.routes");
    app.use("/order", orderRoutes);

    const officeOrderRoutes = require("./modules/officeOrder/officeOrder.routes");
    app.use("/office-order", officeOrderRoutes);
    const customerRoutes = require("./modules/customer/customer.routes");
    app.use("/customer", customerRoutes);

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
