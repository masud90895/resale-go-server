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
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.2vi6qur.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Create a async function to all others activity
async function run() {
  try {
    // Create Database to store Data
    const productCollection = client.db("resale-go").collection("products");
    const brandCollection = client.db("resale-go").collection("brand");
    const userCollection = client.db("resale-go").collection("users");

    app.get("/brand", async (req, res) => {
      const brands = await brandCollection.find({}).limit(3).toArray();
      res.send(brands);
    });
    app.get("/products", async (req, res) => {
      const products = await brandCollection.find({}).toArray();
      res.send(products);
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const products = await brandCollection.findOne({ _id: ObjectId(id) });
      res.send(products);
    });
    app.get("/brand/:name", async (req, res) => {
      const name = req.params.name;
      console.log(req.params);
      const products = await productCollection.find({ brand: name }).toArray();
      res.send(products);
    });

    app.post("/users", async (req, res) => {
      const result = await userCollection.insertOne(req.body);
      res.send(result);
    });

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
