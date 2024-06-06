function generateTime(date) {
    const time = new Date(date);
    const futureTime = new Date(date);
    const tenHours = 10 * 60 * 60 * 1000;
    futureTime.setTime(time.getTime() + tenHours);
    return futureTime.getTime();
}

module.exports = {generateTime};