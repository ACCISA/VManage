// StartStopButton.jsx
import React, { useState } from 'react';

const StartStopButton = () => {
  const [isRunning, setIsRunning] = useState(false);

  const handleToggle = () => {
    setIsRunning((prev) => !prev);
    // Perform additional actions when the button is clicked
    // For example, start or stop a process, timer, etc.
    if (!isRunning) {
      // Start action
      console.log('Start action');
    } else {
      // Stop action
      console.log('Stop action');
    }
  };

  return (
    <button className={`start-stop-button ${isRunning ? 'running' : 'stopped'}`} onClick={handleToggle}>
      {isRunning ? 'Stop' : 'Start'}
    </button>
  );
};

export default StartStopButton;
