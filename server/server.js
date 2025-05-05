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
app.get("/api/get_venues", async (req, res) => {
  const queries = req.query.query;
  const newQueries = queries.split("|").map(q => q.trim());
  console.log(newQueries)
  const output = [];

  try {
    //send new query to Places API
    for (const query of newQueries) {
      const placesURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&key=${process.env.PLACES_API_KEY}`;

      const response = await fetch(placesURL);
      const data = await response.json();
      output.push(data);
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed" });
  }
  console.log(output);
  res.json(output);
});

//determine if there is enough information to create a proper query or ask for more info if necessary
app.get("/api/generate_query", async (req, res) => {
  const query = req.query.query;

  try {
    //make call to OpenAi to rewrite user search
    const openAIPrompt = `You are an assistant that will reword user quieres for the Google Maps Places API
    Step 1: Analyze what the user is looking for from : "${query}". 
      First, determine the number of different venues the user is looking to attend.
      Then reword the query into the respective number of phrases that would return relevant results as a Google Maps API textsearch query.
      Make sure you understand what the user is looking for, and some key details, such as the type of food. Do not hesitate to ask questions.
    Step 2: If the query is understood, return:
       Rewritten query or queries seperated by the delimiter: "|". Make sure that every venue has its own query. Example Format: query1|query2|query3
    Step 3: If the query is ambiguous or missing information, return:
      QUESTION: [clarifying question here]
    Don't return "step 1,2,3", only return clear or question and the respetive text`;

    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: openAIPrompt }],
      max_tokens: 100,
    });
    const output = openAIResponse.choices[0].message.content.trim().split("|");
    console.log("Output: " + output);

    res.json(output);
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
    )}. Try to keep the description to within 2 sentences, but be as specific as possible. Don't include the exact address, ratings, reviews, or price level. If giving location, be more specific than just the city name. Aspects to focus on: unique features, general part of the city, type of vibe(relaxed, upscale, authentic). If necessary, search the web for this venure and generate description based on what is found. Try not to use generic terms that could be used to describe large quanitites of places."`;
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
