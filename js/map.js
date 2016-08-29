var map;
var markers = [];

function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 41.385064, lng: 2.173403},
		zoom: 13
	});

	 var bounds = new google.maps.LatLngBounds();

	for (var i = 0; i < initialLocations.length; i++) {
		var position = initialLocations[i].location;
		var title = initialLocations[i].title;

		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP
	});
		markers.push(marker);

		marker.addListener('click', function(){
			toggleBounce(this);
		});

		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);

    marker.addListener('mouseout', function(){
			marker.setAnimation(null);
		});
  }
}