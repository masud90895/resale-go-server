const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
//gitignor
require("dotenv").config();
const port = process.env.PORT || 5000;

// used Middleware
app.use(cors());
// backend to client data sent
app.use(express.json());

// Connact With MongoDb Database
const uri =
  `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.2vi6qur.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Create a async function to all others activity
async function run() {
  try {
    // Create Database to store Data
    const brandCollection = client.db("resale-go").collection("brand");
  } finally {
    // await client.close();
  }
}

// Call the fuction you decleare abobe
run().catch(console.dir);

// Root Api to cheack activity
app.get("/", (req, res) => {
  res.send("Hello From server!");
});

app.listen(port, () => console.log(`Server up and running ${port}`));
