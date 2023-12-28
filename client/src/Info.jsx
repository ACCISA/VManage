import React, { useState } from 'react';
import './Test.css';
import EditButton from './EditButton';
import StartStopButton from './StartStopButton';


const TestComponent = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleButtonClick = () => {
    setIsClicked((prev) => !prev);
  };

  return (
    <div>
      <div id="info" className={isClicked ? 'is-clicked' : ''}>
        <ul>
          <li>VM name</li>
          <li>VM path</li>
          <li>VM IP address</li>
          <li>VM Operating System</li>
          <li><EditButton></EditButton></li>
          <li><StartStopButton></StartStopButton></li>
        </ul>
      </div>
      <a href="#" className="btn" onClick={handleButtonClick}>a.btn</a>
    </div>
  );
};

export default TestComponent;
