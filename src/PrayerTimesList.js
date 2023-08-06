import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, Divider, Container } from '@mui/material';
import useLocalStorage from './useLocalStorage';
import AdzanSound from './adzan/adzan.mp3';

const PrayerTimesList = () => {
  const [storedLatitude, setStoredLatitude] = useLocalStorage('latitude', 0);
  const [storedLongitude, setStoredLongitude] = useLocalStorage('longitude', 0);
  const [prayerTimes, setPrayerTimes] = useState({});
  const [locationName, setLocationName] = useState('');
  const method = 2;
  const prayerTimesKeys = Object.keys(prayerTimes);

  const [isAdhanRequested, setIsAdhanRequested] = useState(false);
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);

  useEffect(() => {
    fetchPrayerTimes();
    fetchLocationName();

    const checkPrayerTimes = () => {
      const now = new Date();
      const currentTime = now.getHours() + ':' + now.getMinutes();

      if (prayerTimes['Fajr'] === currentTime) {
        // Memainkan adzan ketika waktu Fajr
        playAdhan();
      } else if (prayerTimes['Dhuhr'] === currentTime) {
        // Memainkan adzan ketika waktu Dhuhr
        playAdhan();
      } else if (prayerTimes['Asr'] === currentTime) {
        // Memainkan adzan ketika waktu Asr
        playAdhan();
      } else if (prayerTimes['Maghrib'] === currentTime) {
        // Memainkan adzan ketika waktu Maghrib
        playAdhan();
      } else if (prayerTimes['Isha'] === currentTime) {
        // Memainkan adzan ketika waktu Isha
        playAdhan();
      }
    };

    // Memeriksa waktu sholat setiap satu menit
    const interval = setInterval(checkPrayerTimes, 60000);

    return () => clearInterval(interval);
  }, [storedLatitude, storedLongitude, prayerTimes]);

  const fetchPrayerTimes = async () => {
    try {
      const now = new Date();
      const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

      const response = await axios.get(`https://api.aladhan.com/v1/timings/${date}`, {
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

  const playAdhan = () => {
    const audio = new Audio(AdzanSound);
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
        {isAdhanPlaying
          ? 'Memutar Adzan...'
          : isAdhanRequested
          ? 'Klik lagi untuk memutar Adzan'
          : 'Putar Adzan'}
      </button>
    </Container>
  );
};

export default PrayerTimesList;
