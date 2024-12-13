import Places from './Places.jsx';
import { useState, useEffect } from 'react';
import Error from './Error'; 
import { sortPlacesByDistance } from '../loc.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const response = await fetch("http://localhost:3000/places");
        const resData = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch places");
        }
        navigator.geolocation.getCurrentPosition((position)=>{
            const sortedPlaces = sortPlacesByDistance(resData.places,position.coords.latitude,position.coords.longitude);
            setAvailablePlaces(sortedPlaces);
            setIsFetching(false);
            console.log(position.coords.latitude)
            console.log(position.coords.longitude)
        })
       
      } catch (error) {
        setError({
          message: error.message || "Could not fetch places, please try again later",
        });
        setIsFetching(false);
      }
      
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="An Error Occurred" message={error.message} onConfirm={() => setError(null)} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      LoadingText="Fetching Data...."
      isLoading={isFetching}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
