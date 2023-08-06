import React, { useContext, useState } from 'react';
import { QuranContext } from './QuranContext';

function Quran() {
  const { loading, error, data } = useContext(QuranContext);
  const ayahsPerPage = 15 * 20; // 15 lines per page, 20 pages per juz
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Calculate the index range of ayahs to be displayed on the current page
  const startIndex = (currentPage - 1) * ayahsPerPage;
  const endIndex = Math.min(startIndex + ayahsPerPage, data.length);

  // Calculate the current juz based on the current page
  const currentJuz = Math.ceil(currentPage / 20);

  return (
    <div>
      {data.slice(startIndex, endIndex).map((surah) => (
        <div key={surah.index}>
          <p style={{ fontSize: '24px', textAlign: 'center' }}>{surah.name}</p>
          {surah.ayahs.map((ayah, index) => (
            <p
              key={surah.index + '-' + index}
              style={{
                fontSize: '18px',
                border: '1px solid #ccc',
                padding: '5px',
                margin: '5px',
                borderRadius: '5px',
              }}
            >
              {ayah.text}
            </p>
          ))}
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <button onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))} disabled={currentPage === 1}>
          Previous Page
        </button>
        <span style={{ margin: '0 10px', fontSize: '18px' }}>Juz {currentJuz}</span>
        <button
          onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(data.length / ayahsPerPage)))}
          disabled={endIndex === data.length}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default Quran;
