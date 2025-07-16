import React, { useState, useEffect } from 'react';

export const Mode = async (mode) => {
  try {
    if (mode.toLowerCase().includes("automatic")) {
      const quantityInput = prompt("Enter quantity for automatic mode:");
      const quantity = parseFloat(quantityInput);

      if (isNaN(quantity) || quantity <= 0) {
        alert("Invalid quantity. Please enter a positive number.");
        return;
      }

      const response = await fetch(`http://localhost:8081/api/machine/control?status=ON&quantity=${quantity}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
      });

      const result = await response.text();
      alert(result || "Automatic mode activated.");
      //localStorage.setItem('machineMode', 'AUTOMATIC');
      return { message: result };

    } else if (mode.toLowerCase() === "manual") {
      const confirmManual = window.confirm("Are you sure you want to switch to manual mode? This will stop automatic scheduling.");
      if (!confirmManual) {
        return; // User canceled
      }

      const response = await fetch(`http://localhost:8081/api/machine/control?status=OFF&quantity=0`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
      });

      const result = await response.text();
      alert(result || "Manual mode activated. Machine turned OFF.");
     // localStorage.setItem('machineMode', 'MANUAL');
      return { message: result };

    } else {
      alert("Unknown mode");
    }
  } catch (error) {
    console.error('Error switching mode:', error);
    alert(error.message || 'Failed to switch mode. Please try again.');
    throw error;
  }
};

const MachineControl = () => {
  const [mode, setMode] = useState(localStorage.getItem('machineMode') || 'MANUAL');
  const [machineStatus, setMachineStatus] = useState('OFF'); // Could be fetched from backend if needed
  const [loading, setLoading] = useState(false);

  // Call Mode function and update mode state/localStorage
const switchMode = (selectedMode) => {
  const upperMode = selectedMode.toUpperCase();
  
  // 1. Update UI immediately
  setMode(upperMode);
  localStorage.setItem('machineMode', upperMode);

  // 2. Call backend without waiting (no await)
  Mode(selectedMode)
    .then((result) => {
      if (!result) {
        throw new Error("Unexpected backend response");
      }
    })
    .catch((error) => {
      // On error, revert the UI and inform the user
      alert("Failed to switch mode. Reverting to MANUAL.");
      setMode("MANUAL");
      localStorage.setItem("machineMode", "MANUAL");
    });
};



  // Toggle start/stop machine, only allowed in MANUAL mode
  const toggleMachine = async () => {
   
    setLoading(true);
    try {
      const newStatus = machineStatus === 'ON' ? 'OFF' : 'ON';

      const response = await fetch(
        `http://localhost:8081/api/machine/control?status=${newStatus}&quantity=0`,
        { method: 'POST', headers: { 'Accept': 'application/json' } }
      );
      if (!response.ok) {
        throw new Error('Failed to toggle machine');
      }
      const resText = await response.text();
      alert(resText || `Machine turned ${newStatus}`);

      setMachineStatus(newStatus);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
      <h3>Machine Mode Control</h3>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Current Mode:</strong> {mode}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={() => switchMode('manual')}
          disabled={loading || mode === 'MANUAL'}
          style={{ padding: '0.5rem 1rem' }}
        >
          Manual Mode
        </button>
        <button
          onClick={() => switchMode('automatic')}
          disabled={loading || mode === 'AUTOMATIC'}
          style={{ padding: '0.5rem 1rem' }}
        >
          Automatic Mode
        </button>
      </div>

      <button
        onClick={toggleMachine}
        disabled={loading || mode === 'AUTOMATIC'}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: machineStatus === 'ON' ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: mode === 'AUTOMATIC' ? 'not-allowed' : 'pointer',
          opacity: mode === 'AUTOMATIC' ? 0.5 : 1,
          width: '100%',
        }}
      >
        {loading ? 'Processing...' : machineStatus === 'ON' ? 'Stop Machine' : 'Start Machine'}
      </button>
    </div>
  );
};

export default MachineControl;
