// netlify/functions/proxy.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { url } = event.queryStringParameters; // Pass the API URL as a query parameter
  const API_KEY = "aad3fab1607b552befd9a2ac37e556af"; // Your API key
  const API_URL = `${url}&api_key=${API_KEY}`; // Construct the full API URL

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};
