if (process.env.NODE_ENV.trim() === 'development') {
    require('dotenv').config();
};

const express = require('express');
const app = express();
const port = process.env.PORT || 8745;
const router = require('./routes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

// const axios = require('axios');

// const ytTry = async () => {
//     try {
//         const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=PL-CtdCApEFH-p_Q2GyK4K3ORoAT0Yt7CX&maxResults=100&key=${api_key}&part=contentDetails,snippet&fields=items(id,contentDetails,snippet)`);
//         const videoIds = data.items.map(video => ({ title: video.snippet.title, videoId: video.contentDetails.videoId}));
//         console.log(videoIds);
//     } catch (error) {
//         console.error(error);
//     }
// }

app.listen(port, () => console.log(`Youtube Playlist Length is Run on port ${port}`));
    