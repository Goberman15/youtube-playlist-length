const router = require('express').Router();
const server = require('./api');
const { parse, toSeconds } = require('iso8601-duration');
const durationFormatter = require('./lib/durationFormatter');

const getDuration = async (videoId) => {
    try {
        const { data } = await server.get(
            `/videos?id=${videoId}&key=${process.env.api_key}&part=contentDetails&fields=items(id,contentDetails(duration))`
        );
        return toSeconds(parse(data.items[0].contentDetails.duration));
    } catch (error) {
        console.error(error);
    }
};

const getPlaylistDetails = async (playlistId) => {
    const { data } = await server.get(
        `/playlists?id=${playlistId}&key=${process.env.api_key}&part=snippet&fields=items(snippet(title,channelTitle))`
    );
    return data;
};

const getPlaylistData = async (playlistId, nextPageToken = '') => {
    const { data } = await server.get(
        `/playlistItems?playlistId=${playlistId}&key=${process.env.api_key}&part=contentDetails,snippet&fields=items(id,contentDetails(videoId),snippet(title,thumbnails)),nextPageToken&maxResults=50&pageToken=${nextPageToken}`
    );

    return data;
};

router.get('/', (_, res) => {
    res.json({ author: 'Akbar' });
});

router.get('/:playlistId', async (req, res) => {
    const { playlistId } = req.params;

    try {
        let playlistItems = [];
        let nextPageExisted = false;
        const {
            items: [{ snippet: playlistDetail }]
        } = await getPlaylistDetails(playlistId);
        let data = await getPlaylistData(playlistId);

        if (data.nextPageToken) nextPageExisted = true;

        let { items } = data;
        playlistItems.push.apply(playlistItems, items);

        while (nextPageExisted) {
            data = await getPlaylistData(playlistId, data.nextPageToken);
            playlistItems.push.apply(playlistItems, data.items);

            if (!data.nextPageToken) nextPageExisted = false;
        }

        let playlistData = await Promise.all(
            playlistItems.map(async (video) => {
                let { thumbnails } = video.snippet;
                let thumbnailsQuality = thumbnails.standard || thumbnails.high || thumbnails.maxres;
                return {
                    title: video.snippet.title,
                    img: thumbnailsQuality.url,
                    duration: await getDuration(video.contentDetails.videoId)
                };
            })
        );

        const totalDurationIsSeconds = playlistData.reduce((total, obj) => total + obj.duration, 0);
        const totalDuration = durationFormatter(totalDurationIsSeconds);

        res.status(200).json({
            playlistDetail,
            playlistData,
            totalVideos: playlistItems.length,
            totalDuration
        });
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
