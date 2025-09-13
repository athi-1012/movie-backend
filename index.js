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



// Get all movies
app.get("/movies", async (req, res) => {
  try {
    const movies = await client.db("CRUD").collection("data").find({}).toArray();
    res.status(200).send(movies);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get a single movie by ID
app.get("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await client.db("CRUD").collection("data").findOne({
      _id: new ObjectId(id),
    });
    res.status(200).send(movie);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Add a new movie
app.post("/movies", async (req, res) => {
  try {
    const newMovie = req.body;
    const result = await client.db("CRUD").collection("data").insertOne(newMovie);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Update a movie by ID
app.put("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await client
      .db("CRUD")
      .collection("data")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Delete a movie by ID
app.delete("/movies/:id", async (req, res) => {
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


app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await client.db("CRUD").collection("private").findOne({ email });
    if (existingUser) return res.status(400).send("❌ This user already exists");

    const result = await client.db("CRUD").collection("private").insertOne({ username, email, password });
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
