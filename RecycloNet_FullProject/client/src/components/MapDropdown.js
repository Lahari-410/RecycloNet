import React from 'react';
import './MapDropdown.css';

const MapDropdown = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mapDropdown"
    >
      <option>Area 1</option>
      <option>Area 2</option>
      <option>Area 3</option>
      <option>Area 4</option>
    </select>
  );
};

export default MapDropdown;
