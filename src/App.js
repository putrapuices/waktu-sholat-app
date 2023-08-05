import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CustomNavbar from './Navbar';
import Footer from './Footer';
import PrayerTimesList from './PrayerTimesList';
import SettingPage from './SettingPage';
import WaktuSholatApp from './WaktuSholatApp';
import PrayerTimesCalendar from './PrayerTimesCalendar';

function App() {
  return (
    <Router>
      <LocationProvider>
        <>
          <CustomNavbar />

          <Routes>
            <Route path="/" element={<PrayerTimesList />} />
            <Route path="/setting" element={<SettingPage />} />
            <Route path="/WaktuSholatApp" element={<WaktuSholatApp />} />
            <Route path="/PrayerTimesCalendar" element={<PrayerTimesCalendar />} />
          </Routes>

          <Footer />
        </>
      </LocationProvider>
    </Router>
  );
}

export default App;
