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

  //send query to Open AI for conversion and return places query results
  const processSearch = async (event) => {
    event.preventDefault();
    const new_messages = [];
    //0 = user text, 1 = response text
    new_messages.push([search, 0]);

    setSearch("");

    const response = await fetch(
      `http://localhost:5000/api/generate_query?query=${search}`
    );

    const data = await response.json();
    console.log(data);
    if (data[0].includes("QUESTION:")) {
      new_messages.push([data[0], 1]);
      console.log("question");
    } else {
      getSuggestions(data);
    }
    setConvo((prevText) => [...prevText, ...new_messages]);
    console.log("new msgs", new_messages);
  };

  //send queries to Google Place API
  const getSuggestions = async (queries) => {
    const queryString = encodeURIComponent(queries.join("|"));
    console.log(queryString);
    const response = await fetch(
      `http://localhost:5000/api/get_venues?query=${queryString}`
    );

    const data = await response.json(); 
    console.log(data);
    
    
    setSuggestions(Object.values(data));
    setNumVenues(data.length);
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
