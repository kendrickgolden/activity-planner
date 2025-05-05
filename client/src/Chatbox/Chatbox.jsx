import { useEffect, useState } from "react";
import ChatHistory from "./ChatHistory";

import "./Chatbox.css";
const libraries = ["places"];

function Input({ suggestions, setSuggestions, setNumVenues }) {
  const [search, setSearch] = useState("");

  //store user and GPT responses as list
  const [convo, setConvo] = useState([]);

  //display text as typed
  const updateSearch = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
  };

  //starting prompt for GPT
  const initialPrompt = {
    role: "system",
    content: `You are an assistant that will reword user quieres for the Google Maps Places API
    Step 1: Analyze what the user is looking for. 
      First, determine the number of different venues the user is looking to attend.
      Then reword the query into the respective number of phrases that would return relevant results as a Google Maps API textsearch query.
      Make sure you understand what the user is looking for, and some key details, such as the type of food. Do not hesitate to ask questions.
    Step 2: If the query is understood, return:
       Rewritten query or queries seperated by the delimiter: "|". Make sure that every venue has its own query. Example Format: query1|query2|query3
    Step 3: If the query is ambiguous or missing information, return:
      QUESTION: [clarifying question here]
    Don't return "step 1,2,3", only return clear or question and the respetive text`,
  };

  //send query to Open AI for conversion and return places query results
  const processSearch = async (event) => {
    event.preventDefault();

    const userMessage = { role: "user", content: search };
    const updatedConvo =
      convo.length === 0
        ? [initialPrompt, userMessage]
        : [...convo, userMessage];
    // console.log(updatedConvo);
    setSearch("");

    //send as POST to utlilize convo history
    const response = await fetch(`http://localhost:5000/api/generate_query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedConvo }),
    });

    const data = await response.json();
    console.log("DATA:", data);

    //add GPT response to conversation hitsory
    const AIMessage = data.response.startsWith("QUESTION:")
      ? { role: "assistant", content: data.response.replace("QUESTION: ","") }
      : { role: "assistant", content: "Ok, here you go!" };
    const updatedConvoResponse = [...updatedConvo, AIMessage];
    setConvo(updatedConvoResponse);

    if (data.response.startsWith("QUESTION:")) {
      return;
    } else {
      getSuggestions(data);
    }
  };

  //send queries to Google Place API
  const getSuggestions = async (queries) => {
    const queryArray = queries.output;
    // console.log("QUERIES:", queries.output);
    const queryString = encodeURIComponent(queryArray.join("|"));
    console.log("Q STRING", queryString);
    try {
      const response = await fetch(
        `http://localhost:5000/api/get_venues?query=${queryString}`
      );
      const data = await response.json();
      console.log(data);
      setSuggestions(Object.values(data));
      setNumVenues(data.length);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  return (
    <div id="chatbox">
      <ChatHistory convo={convo} />
      <form onSubmit={processSearch}>
        <label htmlFor="chat_input"></label>
        <textarea
          type="text"
          id="chat_input"
          name="chat_input"
          placeholder="Enter your search..."
          value={search}
          onChange={updateSearch}
        ></textarea>

        <input type="submit" value="Submit" id="submit" />
      </form>
    </div>
  );
}

export default Input;
