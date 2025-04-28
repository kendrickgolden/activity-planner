import { useState } from "react";
import Chatbox from "./Chatbox/Chatbox";
import Recs from "./Recs/Recs";

import "./App.css";

function App() {
    const [suggestions, setSuggestions] = useState([]);
  
  return (
    <>
      <header>
        <h1>Activity Planner Chatbot</h1>
      </header>
      <Chatbox suggestions={suggestions} setSuggestions={setSuggestions}/>
      <Recs suggestions={suggestions}/>
    </>
  );
}

export default App;
