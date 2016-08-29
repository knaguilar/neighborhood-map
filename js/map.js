var map;

function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 41.385064, lng: 2.173403},
		zoom: 13
	});
}