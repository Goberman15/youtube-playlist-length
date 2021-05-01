const isPlural = (num, word) => num > 1 ? `${word}s` : word;

const durationFormatter = (duration) => {
    let days = Math.floor(duration / 86400);
    let hours = Math.floor((duration % 86400) / 3600);
    let minutes = Math.floor((duration % 3600) / 60);
    let seconds = duration % 60;

    return `${
        days ? `${days} ${isPlural(days, 'day')}, ` : ''}${
        hours ? `${hours} ${isPlural(hours, 'hour')}, ` : ''}${
        minutes ? `${minutes} ${isPlural(minutes, 'minute')}, ` : ''}${
        seconds ? `${seconds} ${isPlural(seconds, 'second')}` : ''
    }`;
};

module.exports = durationFormatter;
