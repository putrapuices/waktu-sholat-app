import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const QuranContext = createContext(); // Create the context

export const QuranProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchQuranData = async () => {
      try {
        const response = await axios.get(
          'https://api.alquran.cloud/v1/quran/ar.alafasy'
        );
        setData(response.data.data.surahs);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuranData();
  }, []);

  // Pass the state values to the context provider
  return (
    <QuranContext.Provider value={{ loading, error, data }}>
      {children}
    </QuranContext.Provider>
  );
};
