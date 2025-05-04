import { useState } from "react";
import Chatbox from "./Chatbox/Chatbox";
import Recs from "./Recs/Recs";

import "./App.css";

function App() {
    const [suggestions, setSuggestions] = useState([]);
    const [numVenues, setNumVenues] = useState(0);
  
  return (
    <>
      <header>
        <h1>Activity Planner Chatbot</h1>
      </header>
      <Chatbox suggestions={suggestions} setSuggestions={setSuggestions} setNumVenues={setNumVenues}/>
      <Recs suggestions={suggestions} numVenues={numVenues}/>
    </>
  );
}

export default App;
