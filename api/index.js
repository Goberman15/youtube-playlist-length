const axios = require('axios');

const server = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3'
});

module.exports = server;
