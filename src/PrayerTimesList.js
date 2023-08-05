import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, Divider, Container } from '@mui/material';
import useLocalStorage from './useLocalStorage';
import AdzanSound from './adzan/adzan.mp3'; // Pastikan ini mengarah ke file suara adzan yang benar

const PrayerTimesList = () => {
  const [storedLatitude, setStoredLatitude] = useLocalStorage('latitude', 0);
  const [storedLongitude, setStoredLongitude] = useLocalStorage('longitude', 0);
  const [prayerTimes, setPrayerTimes] = useState({});
  const [locationName, setLocationName] = useState('');
  const method = 2;

  useEffect(() => {
    fetchPrayerTimes();
    fetchLocationName();
  }, [storedLatitude, storedLongitude]);

  const fetchPrayerTimes = async () => {
    try {
      const now = new Date();
      const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

      const response = await axios.get(`http://api.aladhan.com/v1/timings/${date}`, {
        params: {
          latitude: storedLatitude,
          longitude: storedLongitude,
          method,
        },
      });
      setPrayerTimes(response.data.data.timings);
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil jadwal sholat:', error);
    }
  };

  const fetchLocationName = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          format: 'json',
          lat: storedLatitude,
          lon: storedLongitude,
        },
      });
      setLocationName(response.data.display_name);
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil nama lokasi:', error);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const prayerTimesKeys = Object.keys(prayerTimes);

  const [isAdhanRequested, setIsAdhanRequested] = useState(false);
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);

  useEffect(() => {
    if (isAdhanRequested) {
      playAdhan();
    }
  }, [isAdhanRequested]);

  const playAdhan = () => {
    const audio = new Audio(AdzanSound); // Pastikan AdzanSound mengarah ke file suara adzan yang benar
    audio.play();
    setIsAdhanPlaying(true);
    audio.onended = () => {
      setIsAdhanPlaying(false);
      setIsAdhanRequested(false);
    };
  };

  const handleAdhanButtonClick = () => {
    setIsAdhanRequested(true);
  };

  return (
    <Container>
      <Typography variant="h4">Waktu Sholat</Typography>
      <Typography variant="h6">Wilayah: {locationName}</Typography>
      <Typography variant="h6">Latitude: {storedLatitude}</Typography>
      <Typography variant="h6">Longitude: {storedLongitude}</Typography>
      <Divider sx={{ my: 2 }} />
      <List>
        {prayerTimesKeys.map((prayerTime) => (
          <ListItem key={prayerTime}>
            <ListItemText primary={prayerTime} secondary={formatTime(prayerTimes[prayerTime])} />
          </ListItem>
        ))}
      </List>
      <button onClick={handleAdhanButtonClick} disabled={isAdhanPlaying || isAdhanRequested}>
        {isAdhanPlaying ? 'Memutar Adzan...' : isAdhanRequested ? 'Klik lagi untuk memutar Adzan' : 'Putar Adzan'}
      </button>
    </Container>
  );
};

export default PrayerTimesList;
