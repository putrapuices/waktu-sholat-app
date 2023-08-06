import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomNavbar from './Navbar';
import Footer from './Footer';
import PrayerTimesList from './PrayerTimesList';
import SettingPage from './SettingPage';
import WaktuSholatApp from './WaktuSholatApp';
import PrayerTimesCalendar from './PrayerTimesCalendar';
import NotFound from './NotFound';
import Quran from './Quran';
import { QuranProvider } from './QuranContext'; // Import the QuranProvider

function App() {
  return (
    <Router>
      <>
        <CustomNavbar />
        <QuranProvider> {/* Wrap the application with QuranProvider */}
          <Routes>
            <Route path="/" element={<PrayerTimesList />} />
            <Route path="/setting" element={<SettingPage />} />
            <Route path="/WaktuSholatApp" element={<WaktuSholatApp />} />
            <Route path="/PrayerTimesCalendar" element={<PrayerTimesCalendar />} />

            <Route path="/quran" element={<Quran />} /> {/* Quran component route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </QuranProvider>
        <Footer />
      </>
    </Router>
  );
}

export default App;
