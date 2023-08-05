import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import useLocalStorage from './useLocalStorage';

const SettingPage = () => {
  const [newLatitude, setNewLatitude] = useState(0);
  const [newLongitude, setNewLongitude] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [storedLatitude, setStoredLatitude] = useLocalStorage('latitude', 0);
  const [storedLongitude, setStoredLongitude] = useLocalStorage('longitude', 0);

  const handleSetLocation = () => {
    setStoredLatitude(newLatitude);
    setStoredLongitude(newLongitude);
  };

  useEffect(() => {
    // Fetch search results when searchQuery changes
    const fetchSearchResults = async () => {
      if (searchQuery) {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
          );
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      } else {
        setSearchResults([]);
      }
    };
    fetchSearchResults();
  }, [searchQuery]);

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setNewLatitude(lat);
        setNewLongitude(lng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return <Marker position={[newLatitude, newLongitude]} />;
  };

  return (
    <Box>
      <Typography variant="h5">Pengaturan Lokasi</Typography>
      <TextField
        label="Cari wilayah..."
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        margin="normal"
      />
      {searchResults.length > 0 && (
        <Box>
          <Typography variant="subtitle1">Hasil Pencarian:</Typography>
          <ul>
            {searchResults.map((result) => (
              <li key={result.place_id}>
                <Button
                  onClick={() => {
                    setNewLatitude(parseFloat(result.lat));
                    setNewLongitude(parseFloat(result.lon));
                  }}
                >
                  {result.display_name}
                </Button>
              </li>
            ))}
          </ul>
        </Box>
      )}
      <MapContainer center={[newLatitude, newLongitude]} zoom={13} style={{ height: '300px', marginBottom: '16px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
      <TextField
        label="Latitude"
        variant="outlined"
        value={newLatitude}
        onChange={(e) => setNewLatitude(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Longitude"
        variant="outlined"
        value={newLongitude}
        onChange={(e) => setNewLongitude(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSetLocation}>
        Set Lokasi
      </Button>
    </Box>
  );
};

export default SettingPage;
