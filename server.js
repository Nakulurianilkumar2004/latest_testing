const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON bodies

// MongoDB URI and client
const mongoUri = "mongodb+srv://anilkumar:9392832240@cluster0.guvwb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(mongoUri);

let db;
let collections = {};

// Connect to MongoDB and initialize collections
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    db = client.db("quiz_app");
    collections = {
      after10th: db.collection("after10th_users"),
      after12th: db.collection("after12th_users"),
      afterdegree: db.collection("afterdegree_users"),
      examprep: db.collection("examprep_users"),
    };
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Simple validation function
function validateFormData(data) {
  const requiredFields = ["name", "email", "phone", "location", "interest"];
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === "") {
      return `Field "${field}" is required.`;
    }
  }
  return null;
}

// POST routes for all four forms

app.post("/api/submit_after10th", async (req, res) => {
  const formData = req.body;
  const validationError = validateFormData(formData);
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const result = await collections.after10th.insertOne(formData);
    res.status(201).json({ message: "After 10th form submitted successfully", id: result.insertedId });
  } catch (error) {
    console.error("❌ Error inserting After 10th data:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

app.post("/api/submit_after12th", async (req, res) => {
  const formData = req.body;
  const validationError = validateFormData(formData);
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const result = await collections.after12th.insertOne(formData);
    res.status(201).json({ message: "After 12th form submitted successfully", id: result.insertedId });
  } catch (error) {
    console.error("❌ Error inserting After 12th data:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

app.post("/api/submit_afterdegree", async (req, res) => {
  const formData = req.body;
  const validationError = validateFormData(formData);
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const result = await collections.afterdegree.insertOne(formData);
    res.status(201).json({ message: "After Degree form submitted successfully", id: result.insertedId });
  } catch (error) {
    console.error("❌ Error inserting After Degree data:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

app.post("/api/submit_examprep", async (req, res) => {
  const formData = req.body;
  const validationError = validateFormData(formData);
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const result = await collections.examprep.insertOne(formData);
    res.status(201).json({ message: "Exam Preparation form submitted successfully", id: result.insertedId });
  } catch (error) {
    console.error("❌ Error inserting Exam Prep data:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// Health check route
app.get("/", (req, res) => {
  res.send("🎉 Career Guidance API Server is running!");
});

// Start server only after connecting to DB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});
