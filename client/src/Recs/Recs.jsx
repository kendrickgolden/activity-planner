import { useEffect, useState } from "react";
import "./Recs.css";

function Recs({ suggestions }) {
  /*const [numSuggestions, setNumSuggestions] = useState(0);*/
  const [images, setImages] = useState([]);

  useEffect(() => {
    const getImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/venue_images?query=${suggestions[0].photos[0].photo_reference}`
        );
        const data = await response.blob();
        const imageURL = URL.createObjectURL(data);
        setImages(imageURL);
        console.log("Images: ", data);
        console.log("TESTING");
      } catch (error) {
        console.error("Image fetch failed: ", error);
      }
    };

    if (suggestions.length > 0) {
      getImages();
    }
  }, [suggestions]);

  return (
    <div id="recs">
      <h2>Recomendations:</h2>
      {suggestions && suggestions.length > 0 ? (
        <div className="rec_card">
          {/*} <h3 className="datetime">Date: --- Time:</h3>*/}
          <div className="venue">
            <img src={images} alt="Venue" />
            <div className="details">
              <h4 className="name">{suggestions[0].name}</h4>
              <div className="stars">Rating: {suggestions[0].rating}</div>
              <div className="desc">Desc</div>
            </div>
          </div>
        </div>
      ) : (
        <div>Enter a query to receive suggestions</div>
      )}
    </div>
  );
}

export default Recs;
