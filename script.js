document.addEventListener('DOMContentLoaded', function () {
  // Wallet address to be used for each RPC request
  const walletAddress = "0x6DA62967e52BDc3f458F93FFa37FCcF007863269";

  // Dummy data for existing RPC URLs
  let rpcUrls = [
      "https://rpc1.example.com",
      "https://rpc2.example.com",
      "https://rpc3.example.com"
  ];

  // Function to update the list of RPC URLs
  function updateRpcList() {
      const rpcList = document.getElementById('rpc-list');
      rpcList.innerHTML = ''; // Clear previous list
      rpcUrls.forEach(url => {
          const li = document.createElement('li');
          li.textContent = url;
          li.className = 'rpc-item';
          rpcList.appendChild(li);
      });
  }

  // Initial update of RPC list
  updateRpcList();

  // Button click event handler to add new RPC URL
  document.getElementById('add-url-btn').addEventListener('click', function () {
      const newUrl = document.getElementById('new-url-input').value.trim();
      if (newUrl !== '') {
          rpcUrls.push(newUrl);
          updateRpcList(); // Update the RPC list
          document.getElementById('new-url-input').value = ''; // Clear input field
      }
  });
});
