import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, Divider, Container } from '@mui/material';
import useLocalStorage from './useLocalStorage';

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

  useEffect(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Check if the current time matches any prayer time and play the adzan sound
    if (prayerTimes) {
      for (const prayerTime in prayerTimes) {
        const time = prayerTimes[prayerTime];
        const [hours, minutes] = time.split(':');
        const prayerTimeInMinutes = parseInt(hours) * 60 + parseInt(minutes);

        if (currentTime === prayerTimeInMinutes) {
          playAdzanSound();
          break;
        }
      }
    }
  }, [prayerTimes]);

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
      console.error('Error fetching prayer times:', error);
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
      console.error('Error fetching location name:', error);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const prayerTimesKeys = Object.keys(prayerTimes);

  const playAdzanSound = () => {
    const adzanAudio = new Audio('/adzan/adzan.mp3');
    adzanAudio.play();
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
    </Container>
  );
};

export default PrayerTimesList;
