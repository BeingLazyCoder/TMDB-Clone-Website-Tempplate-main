const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const API_KEY = process.env.TMDB_API_KEY;
  const { path, queryStringParameters } = event;

  const url = `https://api.themoviedb.org/3${path}?api_key=${API_KEY}&${new URLSearchParams(queryStringParameters)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};