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

router.get('/', (_, res) => {
    res.json({ author: 'Akbar' });
});

router.get('/:playlistId', async (req, res) => {
    const { playlistId } = req.params;

    try {
        const {
            data: { items }
        } = await server.get(
            `/playlistItems?playlistId=${playlistId}&key=${process.env.api_key}&part=contentDetails,snippet&fields=items(id,contentDetails(videoId),snippet(title, thumbnails(standard)))&maxResults=50`
        );

        let playlistData = await Promise.all(
            items.map(async (video) => {
                return {
                    title: video.snippet.title,
                    img: video.snippet.thumbnails.standard.url,
                    duration: await getDuration(video.contentDetails.videoId)
                };
            })
        );

        const totalDurationIsSeconds = playlistData.reduce((total, obj) => total + obj.duration, 0);
        const totalDuration = durationFormatter(totalDurationIsSeconds);

        res.status(200).json({
            playlistData,
            totalDuration
        });
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
