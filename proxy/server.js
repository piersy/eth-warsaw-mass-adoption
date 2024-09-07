const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Define the proxy options
const proxyOptions = {
  target: 'http://svc-331-u22133.vm.elestio.app:8000',  // Replace with the actual external URL
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Origin', 'http://localhost');  // Optional: Replace with your domain if necessary
  }
};

// Setup the proxy
app.use('/', createProxyMiddleware(proxyOptions));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});