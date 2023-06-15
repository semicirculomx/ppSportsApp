import React, { useState } from 'react';

const PinballSwitch = ({ activateAnalysis }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    activateAnalysis(!isChecked);
  };

  return (
    <>
      <div className="toggle-container">
        <input
          className="toggle-input"
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
        />
        <div className="toggle-handle-wrapper">
          <div className="toggle-handle">
            <div className="toggle-handle-knob"></div>
            <div className="toggle-handle-bar-wrapper">
              <div className="toggle-handle-bar"></div>
            </div>
          </div>
        </div>
        <div className="toggle-base">
          <div className="toggle-base-inside"></div>
        </div>
      </div>
    </>
  );
};

export default PinballSwitch;