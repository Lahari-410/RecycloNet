import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import MapPicker from './components/MapPicker';
import './App.css';

// Connect to backend
const socket = io('http://localhost:5000');

const App = () => {
  const [pickups, setPickups] = useState([]);
  const [item, setItem] = useState('');
  const [location, setLocation] = useState(null); // [lat, lng]
  const [photo, setPhoto] = useState('');

  // Get pickups from backend
  const fetchPickups = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/pickups');
      setPickups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPickups();

    socket.on('pickupStatusChanged', (data) => {
      setPickups((prev) =>
        prev.map((p) => (p._id === data._id ? data : p))
      );
    });

    return () => socket.off('pickupStatusChanged');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.trim() || !location) return;

    try {
      const locString = `${location[0]},${location[1]}`;
      const res = await axios.post('http://localhost:5000/api/pickups', {
        item,
        location: locString,
        photo,
      });

      setPickups((prev) => [...prev, res.data]);
      setItem('');
      setPhoto('');
      setLocation(null);

      socket.emit('statusUpdate', res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/pickups/${id}`,
        { status }
      );
      setPickups((prev) =>
        prev.map((p) => (p._id === id ? res.data : p))
      );
      socket.emit('statusUpdate', res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>RecycloNet</h1>

      <section>
        <h2>Request a Pickup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Item name"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          <MapPicker value={location} onChange={setLocation} />
          <input
            type="text"
            placeholder="Photo URL (optional)"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </section>

      <section>
        <h2>Pickup Requests</h2>
        {pickups.length === 0 ? (
          <p>No pickups yet.</p>
        ) : (
          <div>
            {pickups.map((p) => (
              <div key={p._id} className="pickupCard">
                <p><strong>Item:</strong> {p.item}</p>
                <p><strong>Location:</strong> {p.location}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status ${p.status.replace(' ', '')}`}>
                    {p.status}
                  </span>
                </p>
                {p.photo && <img src={p.photo} alt={p.item} className="photo" />}
                {p.status !== 'Completed' && (
                  <div>
                    <button onClick={() => updateStatus(p._id, 'Picked up')}>
                      Picked up
                    </button>
                    <button onClick={() => updateStatus(p._id, 'Completed')}>
                      Complete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default App;
