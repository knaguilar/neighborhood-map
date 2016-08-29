var map;
var markers = [];

function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 41.385064, lng: 2.173403},
		zoom: 13
	});

	var largeInfoWindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();

	for (var i = 0; i < initialLocations.length; i++) {
		var position = initialLocations[i].location;
		var title = initialLocations[i].title;

		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
	});
		markers.push(marker);

		//onclick event to open infoWindow
		//Atribution: Udacity's Google Maps APIS Course
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfoWindow);
		});

		marker.addListener('click', function(){
			toggleBounce(this);
		});

		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow){
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map, marker);

		infowindow.addListener('closeclick', function(){
			infowindow.close();
			marker.setAnimation(null);
		});
	}
}

//bounce when location is clicked and stop when mouseout
function toggleBounce(marker) {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		for (var i = 0; i < markers.length; i++) {
			var mark = markers[i];
			if(mark.getAnimation() !== null){
				mark.setAnimation(null);
			}
		}
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}