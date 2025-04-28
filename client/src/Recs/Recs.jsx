import "./Recs.css";
import { useState } from "react";

function Recs({suggestions}) {
  /*const [numSuggestions, setNumSuggestions] = useState(0);*/
/*`https://maps.googleapis.com/maps/api/place/photo?maxwidth=4000&photo_reference=${suggestions[0].photos[0].photo_reference}&key=AIzaSyDV9vvgvCz9W2YmXQHTcf_4lU93hCulmbU`*/
  return (
    <div id="recs">
      <h2>Recomendations:</h2>
      {suggestions && suggestions.length > 0 ? (<div className="rec_card">
       {/*} <h3 className="datetime">Date: --- Time:</h3>*/}
        <div className="venue">
          <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=4000&photo_reference=${suggestions[0].photos[0].photo_reference}&key=AIzaSyDV9vvgvCz9W2YmXQHTcf_4lU93hCulmbU`} alt="" />
          <div className="details">
            <h4 className="name">{suggestions[0].name}</h4>
            <div className="stars">Rating: {suggestions[0].rating}</div>
            <div className="desc">Desc</div>
          </div>
        </div>
      </div>) : <div>Enter a query to receive suggestions</div>}
    </div>
  );
}

export default Recs;
