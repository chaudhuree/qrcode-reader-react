import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function App() {
  const [scanResult, setScanResult] = useState(null);
  const [manualSerialNumber, setManualSerialNumber] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [scannerKey, setScannerKey] = useState(0);
  const scannerRef = useRef(null);

  useEffect(() => {
    const readerElement = document.getElementById("reader");

    if (scannerRef.current || !readerElement || !isScanning) {
      return;
    }

    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      {
        fps: 5,
        qrbox: {
          width: 400,
          height: 400,
        },
      },
      false
    );

    scannerRef.current.render(success, error);

    // Success callback during scanning
    function success(result) {
      setScanResult(result);
      setIsScanning(false);
    }

    // Error callback during scanning
    function error(err) {
      console.error("QR Scanner Error: ", err);
    }

    return () => {
      // Ensure proper cleanup when component unmounts or when dependencies change
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((err) => console.error("Error clearing scanner:", err));
        // Reset scanner reference after clearing
        scannerRef.current = null;
      }
    };
  }, [isScanning, scannerKey]);

  // Handle manual serial number input
  function handleManualSerialNumberChange(event) {
    setManualSerialNumber(event.target.value);
  }

  // Reset scanning process
  function resetScanner() {
    // Clear scanned result
    setScanResult(null);
    // Clear manual input
    setManualSerialNumber("");
    // Restart scanning
    setIsScanning(true);
    // Force re-render by changing the key
    setScannerKey((prevKey) => prevKey + 1);
  }

  // Save the scanned data
  function saveData() {
    alert("Data saved: " + scanResult.slice(-16));
    resetScanner();
  }
  return (
    <div className="App">
      <div className="qrcode-container">
        <h1 className="center">QR Scanning Code</h1>
        {isScanning ? <div id="reader" key={scannerKey}></div> : null}

        {/* Render the scan result at the bottom */}
        {scanResult && !manualSerialNumber && (
          <div className="scan-result center">
            <p>Scanned Data: {scanResult.slice(-16)}</p>
            <div className="gap-between">
              <button className="btn" onClick={saveData}>
                Save Data
              </button>
              <button className="btn" onClick={resetScanner}>
                Scan New
              </button>
            </div>
          </div>
        )}

        <p className="center-text center">
          Or enter the serial number manually:
        </p>
        <div className="center-input center">
          <input
            className="input-field"
            type="text"
            value={manualSerialNumber}
            onChange={handleManualSerialNumberChange}
          />
          {manualSerialNumber && (
            <p>Serial Number: {manualSerialNumber.slice(-16)}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
