import { useEffect, useState } from "react";
import "./Recs.css";

function Recs({ suggestions }) {
  /*const [numSuggestions, setNumSuggestions] = useState(0);*/
  //use dictionary to retrieve venue images with their 'place_id'
  const [images, setImages] = useState({});
  const [descriptions, setDescriptions] = useState([]);

  //Display venue rating as stars
  const displayStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <>
        {"★".repeat(fullStars)}
        {halfStar && "½"}
        {"☆".repeat(emptyStars)}
      </>
    );
  };
  const venueCards = suggestions.map((suggestion) => {
    const id = suggestion.results[0].place_id;
    const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${id}`;
    return (
      <a key={id} href={mapsUrl} target="_blank" className="maps_link">
        <div className="rec_card">
          <div className="venue">
            <img
              src={images[id]}
              alt={`${suggestion.results[0].name} venue`}
              onError={(e) => (e.target.style.display = "none")}
            />
            <div className="details">
              <h4 className="name">{suggestion.results[0].name}</h4>
              <div className="rating">
                Rating: {displayStars(suggestion.results[0].rating)} (
                {suggestion.results[0].rating})
              </div>
              <div className="desc" data-fulltext={descriptions[id]}>
                {descriptions[id]}
              </div>
            </div>
          </div>
        </div>
      </a>
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
          <h2>Recommendations:</h2>
          {venueCards}
        </div>
      ) : (
        <div>Enter a query to receive suggestions</div>
      )}
    </div>
  );
}

export default Recs;
