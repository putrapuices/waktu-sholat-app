import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faSun } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = 'https://api.aladhan.com/v1';

const PrayerTimesCalendar = () => {
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [prayerTimes, setPrayerTimes] = useState([]);

    useEffect(() => {
        fetchPrayerTimes();
    }, [city, country, selectedDate]);

    const fetchPrayerTimes = async () => {
        try {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;

            const response = await axios.get(`${API_BASE_URL}/calendarByCity/${year}/${month}`, {
                params: {
                    city: city,
                    country: country,
                    method: 2,
                },
            });

            if (response.status === 200 && response.data && response.data.data) {
                setPrayerTimes(response.data.data);
            } else {
                console.error('Error fetching prayer times:', response.data);
                setPrayerTimes([]); // Set prayerTimes to an empty array to prevent errors
            }
        } catch (error) {
            console.error('Error fetching prayer times:', error);
            setPrayerTimes([]); // Set prayerTimes to an empty array to prevent errors
        }
    };

    const getDateWithLeadingZero = (day) => {
        return day < 10 ? `0${day}` : day.toString();
    };

    const getIconForPrayerTime = (prayerTime) => {
        // Code untuk mendapatkan ikon berdasarkan waktu sholat
        // Misalnya, jika prayerTime adalah Fajr, gunakan faClock, jika Midnight gunakan faSun, dst.
        if (prayerTime === 'Fajr' || prayerTime === 'Midnight' || prayerTime === 'Imsak') {
            return faSun;
        } else {
            return faClock;
        }
    };

    return (
        <div className="prayer-times-calendar">
            <h1 className="mt-4">Jadwal Waktu Sholat dan Adzan</h1>
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
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                />
            </div>
            <button className="btn btn-primary" onClick={fetchPrayerTimes}>
                Cari Jadwal Sholat
            </button>

            {prayerTimes.length > 0 ? (
                <div className="mt-4">
                    <ul className="prayer-times-list">
                        {prayerTimes.map((data, index) => (
                            <li key={index} className="prayer-time-item">
                                <div className="prayer-time-date">
                                    <FontAwesomeIcon icon={faClock} />
                                    <span>Date: {data.date.readable}</span>
                                </div>
                                {Object.entries(data.timings).map(([key, value]) => (
                                    <div key={key} className="prayer-time">
                                        <FontAwesomeIcon icon={getIconForPrayerTime(key)} />
                                        <span>{key}: {value}</span>
                                    </div>
                                ))}
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

export default PrayerTimesCalendar;
