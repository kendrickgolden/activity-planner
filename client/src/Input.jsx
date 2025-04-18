import { useEffect, useState } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
const libraries = ['places'];

function Input(){
    const [city,setCity] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [search, setSearch] = useState("")

    const updateSearch = (event) => {
      event.preventDefault();
      setSearch(event.target.value)
    }

    const findSuggestions = async () => {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${search}&key=AIzaSyDV9vvgvCz9W2YmXQHTcf_4lU93hCulmbU`

      const response = await fetch(url)
      const data = await response.json()

      if (data) {
        setSuggestions(data)
        console.log(data)
      }
    }

    useEffect(() => {
      findSuggestions()
    }, [search]);

    const { isLoaded } = useJsApiLoader({
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
      };


   /* if (!isLoaded) return <p>Loading...</p>;*/

    return(<div>
        <form action="" onSubmit={updateSearch}>
        <label htmlFor="location">Location </label>
       {isLoaded ?  <Autocomplete onLoad={autocomplete => (window.autocomplete = autocomplete)}  onPlaceChanged={() => onPlaceChanged(window.autocomplete)}
  options={{
    types: ['(cities)'],
    fields: ['address_components', 'geometry', 'name'],
  }}>
            <input type="text" id="location" name="location" placeholder="Type in your city..."></input>
        </Autocomplete>  : "Loading....."}
        
        <label htmlFor="venue">Location </label>
        <input type="text" id="venue" name="venue" placeholder="Your venue.." value={search} onChange={updateSearch} ></input>
        <input type="submit" value="Submit"/>
        </form>
        Submitted Search: {search}
        </div>
    )

    }

export default Input
