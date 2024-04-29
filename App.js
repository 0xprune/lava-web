// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function MonitoringPage({ rpcUrls }) {
  const [previousBalances, setPreviousBalances] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      updateAllURLs();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{{"method":"eth_getBalance","params":["0x8D97689C9818892B700e27F316cc3E41e17fBeb9", "latest"],"id":{},"jsonrpc":"2.0"}}'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching data:', error);
      return 'Error';
    }
  };

  const updateUI = async (url) => {
    const balance = await fetchData(url);
    let message;
    if (balance !== 'Error') {
      message = `URL: ${url} - Balance in ETH: ${balance / 1e18}`;
      if (previousBalances[url] !== balance) {
        console.log(`Balance updated for ${url}. New balance: ${balance}`);
        setPreviousBalances(prev => ({ ...prev, [url]: balance }));
      }
    } else {
      message = `URL: ${url} - Error fetching data`;
    }
    return message;
  };

  const updateAllURLs = async () => {
    rpcUrls.forEach(updateUI);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-4">Monitoring RPC</h1>
      <div id="urls-container">
        {rpcUrls.map((url, index) => (
          <div key={index} className="url-item bg-white shadow-md rounded-md p-4 mb-4">
            <p>{url}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddRpcPage({ onAddRpc }) {
  const [newUrl, setNewUrl] = useState('');

  const addUrl = (e) => {
    e.preventDefault();
    if (newUrl.trim()) {
      onAddRpc(newUrl.trim());
      setNewUrl('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-4">Add New RPC URL</h1>
      <form onSubmit={addUrl} className="mb-4">
        <div className="flex items-center">
          <input type="text" id="new-url-input" placeholder="Enter new RPC URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="flex-1 py-2 px-4 rounded-md mr-2" />
          <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add URL</button>
        </div>
      </form>
    </div>
  );
}

function App() {
  const [rpcUrls, setRpcUrls] = useState([
    "https://rpc1.example.com",
    "https://rpc2.example.com",
    "https://rpc3.example.com"
  ]);
  const [page, setPage] = useState('monitoring');

  const handleAddRpc = (newUrl) => {
    setRpcUrls(prevUrls => [...prevUrls, newUrl]);
    setPage('monitoring');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-500 py-4">
        <div className="container mx-auto text-white text-center font-semibold text-xl">RPC URLs Monitor</div>
      </header>
      <div className="container mx-auto mt-4">
        <div className="flex justify-center">
          <button onClick={() => setPage('monitoring')} className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-4">Monitoring RPC</button>
          <button onClick={() => setPage('add')} className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add RPC URL</button>
        </div>
        {page === 'monitoring' && <MonitoringPage rpcUrls={rpcUrls} />}
        {page === 'add' && <AddRpcPage onAddRpc={handleAddRpc} />}
      </div>
    </div>
  );
}

export default App;
