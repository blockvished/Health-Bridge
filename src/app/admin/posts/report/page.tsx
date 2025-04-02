"use client";

import React, { useState, ChangeEvent } from 'react';

function Report() {
  const [showCustom, setShowCustom] = useState<boolean>(false);
  const [selectedSocial, setSelectedSocial] = useState<string>('Show all social type');

  const handleCustomClick = () => {
    setShowCustom(!showCustom);
  };

  const handleSocialChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSocial(e.target.value);
  };

  return (
    <div style={{ backgroundColor: '#f4f4f5', padding: '20px', fontFamily: 'sans-serif', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
          <select
            style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', marginRight: '10px' }}
            value={selectedSocial}
            onChange={handleSocialChange}
          >
            <option>Show all social type</option>
            <option>Facebook</option>
            <option>Twitter</option>
            <option>Tumblr</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button style={{ padding: '10px 15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', marginRight: '8px', cursor: 'pointer', transition: 'background 0.3s' }} className="hover:bg-blue-600">Year</button>
            <button style={{ padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', marginRight: '8px', cursor: 'pointer', transition: 'background 0.3s', background: 'white' }} className="hover:bg-gray-100">This Month</button>
            <button style={{ padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', marginRight: '8px', cursor: 'pointer', transition: 'background 0.3s', background: 'white' }} className="hover:bg-gray-100">Last 7 days</button>
            <button style={{ padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.3s', background: 'white' }} className="hover:bg-gray-100" onClick={handleCustomClick}>Custom</button>

            {showCustom && (
              <div style={{ position: 'absolute', background: 'white', border: '1px solid #ddd', borderRadius: '6px', padding: '15px', marginTop: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}>
                <input type="date" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginRight: '10px' }} />
                <input type="date" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginRight: '10px' }} />
                <button onClick={() => setShowCustom(false)} style={{ padding: '8px 12px', background: '#e5e7eb', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.3s' }} className="hover:bg-gray-200">Close</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: '600', color: '#333' }}>Social Network Statistics</h2>

          <div style={{ height: '350px', borderBottom: '1px solid #eee', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', color: '#888' }}>
              Data not found
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <div style={{ width: '18px', height: '18px', background: 'red', marginRight: '8px', borderRadius: '4px' }}></div>
            <span style={{ fontWeight: '500', color: '#444' }}>Facebook</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;