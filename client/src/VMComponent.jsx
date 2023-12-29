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
          <li> <div className="btn" onClick={handleButtonClick}></div></li>
        </ul>
        
        <EditButton></EditButton>
        <StartStopButton></StartStopButton>
        
      </div>
     
    </div>
  );
};

export default TestComponent;
