import { useEffect, useState } from "react";
import "./Recs.css";

function Recs({ suggestions }) {
  /*const [numSuggestions, setNumSuggestions] = useState(0);*/
  //use dictionary to retrieve venue images with their 'place_id'
  const [images, setImages] = useState({});
  const [descriptions, setDescriptions] = useState([]);

  const venueCards = suggestions.map((suggestion) => {
    const id = suggestion.results[0].place_id;
    return (
      <div key={id}>
        <div className="rec_card">
          {/*} <h3 className="datetime">Date: --- Time:</h3>*/}
          <div className="venue">
            <img src={images[id]} alt="Venue" />
            <div className="details">
              <h4 className="name">{suggestion.results[0].name}</h4>
              <div className="stars">
                Rating: {suggestion.results[0].rating}
              </div>
              <div className="desc">{descriptions[id]}</div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  useEffect(() => {
    const getDetails = async () => {
      const getImages = async (suggestion) => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/venue_images?query=${suggestion.results[0].photos[0].photo_reference}`
          );
          const data = await response.blob();
          const imageURL = URL.createObjectURL(data);
          return imageURL;
        } catch (error) {
          console.error("Image fetch failed: ", error);
        }
      };

      const generateDesc = async (suggestion) => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/generate_desc`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ query: suggestion.results[0] }),
            }
          );
          const data = await response.json();

          console.log("Description: ", data);
          return data;
        } catch (error) {
          console.error("Description fetch failed: ", error);
        }
      };

      //make sure suggestions are available before making calls
      if (suggestions.length > 0) {
        const image_dict = {};
        const desc_dict = {};
        for (const suggestion of suggestions) {
          const sug_id = suggestion.results[0].place_id;
          //make call to Google Place API for venue image
          const imgURL = await getImages(suggestion);
          image_dict[sug_id] = imgURL;
          //make call to OpenAI to generate venue description
          const desc = await generateDesc(suggestion);
          desc_dict[sug_id] = desc;
        }

        setImages(image_dict);
        setDescriptions(desc_dict);
      }
    };

    getDetails();
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
