import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faSun } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const API_BASE_URL = 'https://api.aladhan.com/v1';

const WaktuSholatApp = () => {
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [prayerTimes, setPrayerTimes] = useState([]);

    useEffect(() => {
        fetchPrayerTimes();
    }, [city, country, selectedDate]);

    const fetchPrayerTimes = async () => {
        try {
            const method = 8;
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;
            const day = selectedDate.getDate();
            const response = await fetch(
                `${API_BASE_URL}/timingsByCity/${year}-${month}-${day}?city=${city}&country=${country}&method=${method}`
            );
            const data = await response.json();

            if (data.code === 200 && data.data && data.data.timings) {
                setPrayerTimes(data.data.timings);
            } else {
                console.error('Error fetching prayer times:', data);
                setPrayerTimes({}); // Set prayerTimes to an empty object to prevent errors
            }
        } catch (error) {
            console.error('Error fetching prayer times:', error);
            setPrayerTimes({}); // Set prayerTimes to an empty object to prevent errors
        }
    };

    // Helper function to get the day with leading zero
    const getDateWithLeadingZero = (day) => {
        return day < 10 ? `0${day}` : day.toString();
    };

    // Fungsi untuk mendapatkan ikon berdasarkan waktu sholat
    const getIconForPrayerTime = (prayerTime) => {
        if (prayerTime === 'Fajr' || prayerTime === 'Midnight' || prayerTime === 'Imsak') {
            return <FontAwesomeIcon icon={faSun} className="fa-sun" />;
        } else {
            return <FontAwesomeIcon icon={faClock} className="fa-clock" />;
        }
    };

    return (
        <div className="container">
            <h1 className="my-4">Jadwal Waktu Sholat dan Adzan</h1>
            <div className="form-group">
                <label htmlFor="country">Negara</label>
                <input
                    type="text"
                    id="country"
                    className="form-control"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="city">Kota</label>
                <input
                    type="text"
                    id="city"
                    className="form-control"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="selectedDate">Tanggal</label>
                <DatePicker
                    id="selectedDate"
                    className="form-control"
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                />
            </div>
            <button className="btn btn-primary" onClick={fetchPrayerTimes}>
                Cari Jadwal Sholat
            </button>

            {Object.keys(prayerTimes).length > 0 ? (
                <div className="mt-4">
                    <ul>
                        {Object.entries(prayerTimes).map(([key, value]) => (
                            <li key={key}>
                                {getIconForPrayerTime(key)} {/* Memanggil fungsi untuk mendapatkan ikon */}
                                <span>{key}: </span>
                                <span>{value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="mt-4">Tidak ada jadwal sholat yang tersedia.</p>
            )}
        </div>
    );
};

export default WaktuSholatApp;
