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

app.get("/api/places", async (req, res) => {
  const query = req.query.query;

  /*try {
    
  } catch {

  }*/

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
  /* res.send("Server is ready234");*/
});

app.listen(5000, () => {
  console.log("Server started at  http://localhost:5000");
});
