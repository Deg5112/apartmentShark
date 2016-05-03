//test

var panorama;

// StreetViewPanoramaData of a panorama just outside the Google Sydney office.
var outsideGoogle;

// StreetViewPanoramaData for a custom panorama: the Google Sydney reception.
function getReceptionPanoramaData() {
    return {
        location: {
            pano: 'reception',  // The ID for this custom panorama.
            description: 'Google Sydney - Reception',
            latLng: new google.maps.LatLng(-33.86684, 151.19583)
        },
        links: [{
            heading: 195,
            description: 'Exit',
            pano: outsideGoogle.location.pano
        }],
        copyright: 'Imagery (c) 2010 Google',
        tiles: {
            tileSize: new google.maps.Size(1024, 512),
            worldSize: new google.maps.Size(2048, 1024),
            centerHeading: 105,
            getTileUrl: function(pano, zoom, tileX, tileY) {
                return 'images/' +
                    'panoReception1024-' + zoom + '-' + tileX + '-' + tileY + '.jpg';
            }
        }
    };
}

function initPanorama() {
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('street-view'),
        {
            pano: outsideGoogle.location.pano,
            // Register a provider for our custom panorama.
            panoProvider: function(pano) {
                if (pano === 'reception') {
                    return getReceptionPanoramaData();
                }
            }
        });

    // Add a link to our custom panorama from outside the Google Sydney office.
    panorama.addListener('links_changed', function() {
        if (panorama.getPano() === outsideGoogle.location.pano) {
            panorama.getLinks().push({
                description: 'Google Sydney',
                heading: 25,
                pano: 'reception'
            });
        }
    });
}
function initialize() {
    // Use the Street View service to find a pano ID on Pirrama Rd, outside the
    // Google office.
    var streetviewService = new google.maps.StreetViewService;
    streetviewService.getPanorama(
        {location: {lat: -33.867386, lng: 151.195767}},
        function(result, status) {
            if (status === google.maps.StreetViewStatus.OK) {
                outsideGoogle = result;
                initPanorama();
            }
        });
}

