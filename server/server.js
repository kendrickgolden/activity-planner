import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { OpenAI } from "openai";

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello!");
});

//return list of venues
app.get("/api/places", async (req, res) => {
  const query = req.query.query;

  try {
    //make call to OpenAi to rewrite user search
    const openAIPrompt = `Reword this into a phrase that would retain relevant results as a Google Maps API textsearch query: "${query}"`;
    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: openAIPrompt }],
      max_tokens: 30,
    });
    const newQuery = openAIResponse.choices[0].message.content.trim();
    console.log("New Query: " + newQuery);
    //send new query to Places API
    const placesURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&key=${process.env.PLACES_API_KEY}`;

    const response = await fetch(placesURL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed" });
  }
});

//return selected venue images
app.get("/api/venue_images", async (req, res) => {
  const query = req.query.query;

  const imageRequest = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=4000&photo_reference=${query}&key=${process.env.PLACES_API_KEY}`;

  try {
    const response = await fetch(imageRequest);
    const data = await response.arrayBuffer();
    res.set("Content-Type", "image/jpeg");
    res.send(Buffer.from(data));
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to get image" });
  }
});

app.listen(5000, () => {
  console.log("Server started at  http://localhost:5000");
});
