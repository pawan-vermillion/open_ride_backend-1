function GetDistance(userLat, userLong, carLat, carLong) {
    const radius = 6371; 

    const dlatitude = deg2rad(carLat - userLat);
    const dlongitude = deg2rad(carLong - userLong);

    const result = Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
        Math.cos(deg2rad(userLat)) * Math.cos(deg2rad(carLat)) *
        Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2);

    const c = 2 * Math.atan2(Math.sqrt(result), Math.sqrt(1 - result));
    const distance = radius * c; 

    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}


module.exports = {
    deg2rad,
    GetDistance
};
