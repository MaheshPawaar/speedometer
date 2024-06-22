import React, { useState, useEffect, useRef } from 'react';
import Speedometer from 'react-d3-speedometer';
import './App.css';

function App() {
  const [speed, setSpeed] = useState(0);
  const resetTimeoutRef = useRef(null); // To store the timeout reference

  useEffect(() => {
    // establish websocket connetion for real-time data transfer
    const ws = new WebSocket('ws://localhost:5000');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Set speed for UI update
      setSpeed(data.speed);

      // Clear any existing timeout to avoid multiple resets
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }

      // Set a timeout to reset the speed to zero after 2 seconds
      resetTimeoutRef.current = setTimeout(() => {
        setSpeed(0);
      }, 2000);
    };

    return () => {
      ws.close();
      // Clean up the timeout on component unmount
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="App">
      <h1>Speedometer</h1>
      <Speedometer
        value={speed}
        minValue={0}
        maxValue={100}
        segments={10}
        needleColor="steelblue"
        startColor="green"
        endColor="red"
      />
    </div>
  );
}

export default App;
