// LocationContext.js
import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [latitude, setLatitude] = useState(null); // Make sure latitude is set to null initially
  const [longitude, setLongitude] = useState(null); // Make sure longitude is set to null initially

  // Add your geolocation logic here to set the latitude and longitude values

  return (
    <LocationContext.Provider value={{ latitude, longitude }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
