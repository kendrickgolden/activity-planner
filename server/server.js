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
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello!");
});

//return list of venues
app.get("/api/places", async (req, res) => {
  const query = req.query.query;

  try {
    //make call to OpenAi to rewrite user search
    const openAIPrompt = `Reword this into a phrase that would retain relevant results as a Google Maps API textsearch query: "${query}". If the user is looking for multiple different venues return each respective phrase serpated by the delimiter "|". Be careful not to overestimate the number of different venues the user is looking for.`;
    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: openAIPrompt }],
      max_tokens: 30,
    });
    const queries = openAIResponse.choices[0].message.content.trim().split("|");
    console.log("New Query: " + queries);

    const output = [];
    //send new query to Places API
    for (const query of queries) {
      const placesURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&key=${process.env.PLACES_API_KEY}`;

      const response = await fetch(placesURL);
      const data = await response.json();
      output.push(data)
    }
    console.log("Output: ", output)
    res.json(output);
  // res.json(data)
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

//generate description for venues
app.post("/api/generate_desc", async (req, res) => {
  const { query } = req.body;
  // console.log("QUERY is" + JSON.stringify(query));
  try {
    //Extra descriptiors added to help GPT generate more usefull solutions.
    const openAIPrompt = `Use this data to generate a description of the venue "${JSON.stringify(
      query
    )}. Try to keep the description to within 2 sentences. Don't include  the exact address, ratings, reviews, or price level. Aspects to focus on: unique features, general part of the city, type of vibe(relaxed, upscale, authentic). If necessary, search the web for this venure and generate description based on what is found. Try not to use generic terms that could be used to describe large quanitites of places."`;
    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: openAIPrompt }],
      max_tokens: 100,
    });
    const data = openAIResponse.choices[0].message.content.trim();
    // console.log("Description: " + data);
    res.json(data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed" });
  }
});
app.listen(5000, () => {
  console.log("Server started at  http://localhost:5000");
});
