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
    const bookingsCollection = client.db("resale-go").collection("bookings");
    const advertiseCollection = client.db("resale-go").collection("advertise");

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
      const isExists = await userCollection.findOne({ email: req.body.email });
      if (isExists) {
        return;
      }

      const result = await userCollection.insertOne(req.body);
      res.send(result);
    });
    app.post("/bookings", async (req, res) => {
      const result = await bookingsCollection.insertOne(req.body);
      res.send(result);
    });
    app.get("/bookings", async (req, res) => {
      const query = req.query.email;
      const result = await bookingsCollection.find({ email: query }).toArray();
      res.send(result);
    });

    //admin route
    app.get("/allusers/admin/:email", async (req, res) => {
      const email = req.params.email;

      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.role === "Admin" });
    });

    app.get("/allSeller",async (req, res) => {
      const seller = await userCollection.find({role : "Seller"}).toArray()
      res.send(seller)
    })
    app.get("/allUser",async (req, res) => {
      const buyer = await userCollection.find({role : "Buyer"}).toArray()
      res.send(buyer)
    })

    app.delete("/allSeller/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.deleteOne({ _id: ObjectId(id) });
      if (result.deletedCount) {
        res.send(result);
      }
    });

    app.put("/report/:id", async (req, res) => {

      const id= req.params.id;
      /* const findProduct = await productCollection.findOne({_id : ObjectId(id)})
      console.log(findProduct); */

      const result= await productCollection.updateOne({_id: ObjectId(id) },{$set: {report : true}})
      res.send(result)
    })

    app.get('/report',async (req, res)=>{
      const result = await productCollection.find({report : true}).toArray()
      res.send(result)
    })

    app.delete("/report/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      if (result.deletedCount) {
        res.send(result);
      }
    });


//admin route end

    // seller route
    app.get("/allusers/seller/:email", async (req, res) => {
      const email = req.params.email;

      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isSeller: user?.role === "Seller" });
    });

    // seller route end

    //get user
    app.get("/user", async (req, res) => {
      const email = req.query.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    // product post
    app.post("/product", async (req, res) => {
      const data = req.body;
      const result = await productCollection.insertOne(data);
      res.send(result);
    });

    //seller my product list
    app.get("/myProduct", async (req, res) => {
      const query = req.query.email;
      const result = await productCollection.find({ email: query }).toArray();
      res.send(result);
    });

    //seller product delete
    app.delete("/dashboard/myProducts/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      if (result.deletedCount) {
        res.send(result);
      }
    });

    //product advertise
    app.post("/advertise", async (req, res) => {
      const result = await advertiseCollection.insertOne(req.body);
      res.send(result);
    });
    app.get("/advertise", async (req, res) => {
      const query= {}
      const result = await advertiseCollection.find(query).toArray()
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
