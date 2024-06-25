maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: [-74.5,40], // starting position [lng, lat]
    zoom: 4 // starting zoom
});