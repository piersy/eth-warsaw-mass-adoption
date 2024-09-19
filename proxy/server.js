const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Define the proxy options
const proxyOptions = {
  target: 'http://localhost:8082',  // Replace with the actual external URL of the ENS Gateway Server
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying request to:', proxyReq.getHeader('host') + proxyReq.path);
    proxyReq.setHeader('Origin', 'http://localhost');  // Optional: Replace with your domain if necessary
  }
};

// Setup the proxy
app.use('/', createProxyMiddleware(proxyOptions));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT} proxying to ${proxyOptions.target}`);
});