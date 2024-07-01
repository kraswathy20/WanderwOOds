// maptilersdk.config.apiKey = maptilerApiKey;

// const map = new maptilersdk.Map({
//     container: 'map',
//     style: maptilersdk.MapStyle.BRIGHT,
//     center:camp.geometry.coordinates , // starting position [lng, lat]
//     zoom: 10 // starting zoom
// });

// const marker = new maptilersdk.Marker()
//   .setLngLat(camp.geometry.coordinates)
//   .setPopup(
//     new maptilersdk.Popup({ offset: 25 })
//         .setHTML(
//             `<h6>${camp.title}</h6><p>${camp.location}</p>`
//         )
// )
//   .addTo(map);


maptilersdk.config.apiKey = maptilerApiKey;
console.log('Camp data in showPageMap.js:', campss);

if (!campss.geometry || !campss.geometry.coordinates) {
    console.error('Camp geometry or coordinates are missing:', campss);
} else {

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: campss.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

new maptilersdk.Marker()
    .setLngLat(campss.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campss.title}</h3><p>${campss.location}</p>`
            )
    )
    .addTo(map)
            }