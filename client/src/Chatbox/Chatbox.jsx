import { useEffect, useState } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

import "./chatbox.css"
const libraries = ["places"];

function Input() {
  /*const [city,setCity] = useState('');*/
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");

  const updateSearch = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
  };

  const findSuggestions = async (event) => {
    event.preventDefault();
    const response = await fetch(
      `http://localhost:5000/api/places?query=${search}`
    );
    const data = await response.json();

    if (data) {
      setSuggestions(data);
      console.log(data);
    }
  };

  /* useEffect(() => {
      findSuggestions()
    }, [search]);*/

  /*const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyDV9vvgvCz9W2YmXQHTcf_4lU93hCulmbU', 
        libraries,
      });

      const onPlaceChanged = (autocomplete) => {
        const place = autocomplete.getPlace();
        if (!place || !place.address_components) return;
    
        const currentCity = place.address_components.find(component =>
          component.types.includes('locality')
        );
    
        const currentCountry = place.address_components.find(component =>
          component.types.includes('country')
        );
    
        const selectedCity = currentCity?.long_name || place.name;
        const selectedCountry = currentCountry?.long_name || '';
    
        setCity(`${selectedCity}, ${selectedCountry}`);
      };*/

  /* if (!isLoaded) return <p>Loading...</p>;*/

  return (
    <div id="chatbox">
      <form onSubmit={findSuggestions}>
        {/*}  <label htmlFor="location">Location </label>
       {isLoaded ?  <Autocomplete onLoad={autocomplete => (window.autocomplete = autocomplete)}  onPlaceChanged={() => onPlaceChanged(window.autocomplete)}
  options={{
    types: ['(cities)'],
    fields: ['address_components', 'geometry', 'name'],
  }}>
            <input type="text" id="location" name="location" placeholder="Type in your city..."></input>
        </Autocomplete>  : "Loading....."}*/}

        <label htmlFor="chat_input"></label>
        <textarea
          type="text"
          id="chat_input"
          name="chat_input"
          placeholder="Enter your search..."
          value={search}
          onChange={updateSearch}
        ></textarea>
        
        <input type="submit" value="Submit" id="submit"/>
      </form>
    </div>
  );
}

export default Input;
