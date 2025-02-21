import React, { useState } from 'react';
import GlobeComponent from './components/GlobeComponent';
import Arc from './components/Arc';

const App = () => {
  const [arcs, setArcs] = useState([]); // Holds the array of arcs

  // Function to add an arc using the Arc component
  const addArc = (startLat, startLng, endLat, endLng) => {
    const newArc = Arc({
      startLat,
      startLng,
      endLat,
      endLng,
      color: "#ff5722", // Arc color
    });
    setArcs([...arcs, newArc]); // Add new arc to the list
  };

  return (
    <div>
      <GlobeComponent arcs={arcs} /> {/* Pass arcs as props to GlobeComponent */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: "white",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <h3>Add Destination</h3>
        <button onClick={() => addArc(29.4241, -98.4936, 48.8566, 2.3522)}>
          San Antonio → Paris
        </button>
        <button onClick={() => addArc(34.0522, -118.2437, 35.6895, 139.6917)}>
          LA → Tokyo
        </button>
        <button onClick={() => addArc(40.7128, -74.006, 51.5074, -0.1278)}>
          NYC → London
        </button>
      </div>
    </div>
  );
};

export default App;
