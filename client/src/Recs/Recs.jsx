import { useEffect, useState } from "react";
import "./Recs.css";

function Recs({ suggestions }) {
  /*const [numSuggestions, setNumSuggestions] = useState(0);*/
  const [images, setImages] = useState([]);
  const [descriptions, setDescriptions] = useState([]);

  const venueCards = suggestions.map((venue) => (
    <div>
      <div className="rec_card">
        {/*} <h3 className="datetime">Date: --- Time:</h3>*/}
        <div className="venue">
          <img src={images} alt="Venue" />
          <div className="details">
            <h4 className="name">{venue.results[0].name}</h4>
            <div className="stars">Rating: {venue.results[0].rating}</div>
            <div className="desc">{descriptions}</div>
          </div>
        </div>
      </div>
    </div>
  ));

  useEffect(() => {
    const getImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/venue_images?query=${suggestions[0].photos[0].photo_reference}`
        );
        const data = await response.blob();
        const imageURL = URL.createObjectURL(data);
        setImages(imageURL);
        //     console.log("Images: ", data);
        //    console.log("TESTING");
      } catch (error) {
        console.error("Image fetch failed: ", error);
      }
    };

    const generateDesc = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/generate_desc`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: suggestions[0] }),
          }
        );
        console.log(JSON.stringify({ query: suggestions[0] }));
        const data = await response.json();
        setDescriptions(data);
        console.log("Description: ", data);
      } catch (error) {
        console.error("Description fetch failed: ", error);
      }
    };

    if (suggestions.length > 0) {
      getImages();
      //   console.log(JSON.stringify({ query: suggestions[0]}))
      generateDesc();
    }
  }, [suggestions]);

  return (
    <div id="recs">
      {" "}
      {suggestions && suggestions.length > 0 ? (
        <div>
          <h2>Recomendations:</h2>
          {venueCards}
        </div>
      ) : (
        <div>Enter a query to receive suggestions</div>
      )}
    </div>
  );
}

export default Recs;
