import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const client = new MongoClient(process.env.MONGO_URI);

await client.connect();
console.log("✅ Database connected successfully");

app.use(express.json());
app.use(cors());

// Home route
app.get("/", (req, res) => {
  res.status(200).send("Hello, Backend is running 🚀");
});

// Insert one movie
app.post("/post", async (req, res) => {
  try {
    const getPostman = req.body;
    const result = await client.db("CRUD").collection("data").insertOne(getPostman);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Insert many movies
app.post("/postmany", async (req, res) => {
  try {
    const getMany = req.body;
    const result = await client.db("CRUD").collection("data").insertMany(getMany);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get all movies
app.get("/get", async (req, res) => {
  try {
    const result = await client.db("CRUD").collection("data").find({}).toArray();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get one movie
app.get("/getone/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.db("CRUD").collection("data").findOne({
      _id: new ObjectId(id),
    });
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Update movie
app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getPostman = req.body;
    const result = await client
      .db("CRUD")
      .collection("data")
      .updateOne({ _id: new ObjectId(id) }, { $set: getPostman });
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Delete movie
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.db("CRUD").collection("data").deleteOne({
      _id: new ObjectId(id),
    });
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Register user
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userFind = await client.db("CRUD").collection("private").findOne({ email });

    if (userFind) {
      return res.status(400).send("❌ This user already exists");
    }

    const result = await client
      .db("CRUD")
      .collection("private")
      .insertOne({ username, email, password });

    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
