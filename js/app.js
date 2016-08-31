//Array of initial 5 locations that are set by default
var initialLocations = [{
	title: 'Park Güell',
	location: {
		lat: 41.414495,
		lng: 2.152695
	}
}, {
	title: 'La Pedrera',
	location: {
		lat: 41.395247,
		lng: 2.161683
	}
}, {
	title: 'La Sagrada Família',
	location: {
		lat: 41.40448,
		lng: 2.17573
	}
}, {
	title: 'La Barceloneta',
	location: {
		lat: 41.380894,
		lng: 2.189385
	}
}, {
	title: 'Parc de la Ciutadella',
	location: {
		lat: 41.38812,
		lng: 2.18602
	}
}, {
	title: 'Magic Fountain of Montjuic',
	location: {
		lat: 41.371182,
		lng: 2.151671
	}
}];

// Each location on the List has two main properties that can be accessed -
// title and location
var Location = function(data) {
	this.title = data.title;
	this.location = data.location;
}

//Where all the controlling takes palce
var ViewModel = function() {
	var self = this;

	//an array to store all the locations in
	this.locationList = ko.observableArray(
		[]);

	//the list that will appear when being filtered by a keyword
	this.filter = ko.observable();

	//looping through each item in initialLocations and
	//adding it to the array
	initialLocations.forEach(function(
		locationItem) {
		self.locationList.push(new Location(
			locationItem));
	});

	var largeInfoWindow = new google.maps
		.InfoWindow();
	var bounds = new google.maps.LatLngBounds();

	self.locationList().forEach(function(
		location) {
		// define the marker
		var marker = new google.maps.Marker({
			map: map,
			position: location.location,
			title: location.title,
			animation: google.maps.Animation
				.DROP
		});

		location.marker = marker;


		//onclick event to open infoWindow
		//Atribution: Udacity's Google Maps APIS Course
		location.marker.addListener(
			'click',
			function() {
				populateInfoWindow(this,
					largeInfoWindow);
			});

		location.marker.addListener(
			'click',
			function() {
				toggleBounce(this);
			});

		bounds.extend(location.marker.position);

	});

	map.fitBounds(bounds);


	// Attribution for filter: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
	// Idea on how to organize it came from this blog with some modifications eg. display/hide markers
	//It takes in a filter input
	//if not input is given, displays all the locations and all the markers are set on the map
	//if an input is given, it compares the input with the title of each location in locationList
	//and also sets them on the map if they are true - this is after being placed in the locationList
	this.filteredLocations = ko.computed(
		function() {
			var filter = self.filter();
			if (!self.filter()) {
				self.locationList().forEach(
					function(location) {
						location.marker.setMap(map);
					});
				return self.locationList();
			} else {
				return ko.utils.arrayFilter(self.locationList(),
					function(loc) {
						if (loc.title.toLowerCase().indexOf(
								filter.toLowerCase()) !== -1) {
							loc.marker.setMap(map);
						} else {
							loc.marker.setMap(null);
						}
						return loc.title.toLowerCase()
							.indexOf(filter.toLowerCase()) !== -1;
					});
			}
		}, self);

	//bounce when location is clicked
	function toggleBounce(marker) {
		if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
		} else {
			for (var i = 0; i < self.locationList()
				.length; i++) {
				var mark = self.locationList()[i].marker;
				if (mark.getAnimation() !== null) {
					mark.setAnimation(null);
				}
			}
			marker.setAnimation(google.maps.Animation
				.BOUNCE);
		}
	}

	//initially sets the current location to the first item in
	//locationList
	this.currentLocation = ko.observable(
		this.locationList()[0]);


	//this is where the location is set once it has been clicked on
	//it also makes the marker bounce and infoWindow open when selected
	//from the list
	this.setLocation = function(
		clickedLocation) {
		toggleBounce(clickedLocation.marker);
		populateInfoWindow(clickedLocation.marker,
			largeInfoWindow);
		self.currentLocation(
			clickedLocation);
	};
}

// -------------------------------------------------------------------------------------
var map;

function initMap() {
	//I got the try/catch idea from looking at the Udacity discussion forum and
	//tweaked it to work with my own setup
	try {
		map = new google.maps.Map(document.getElementById(
			'map'), {
			center: {
				lat: 41.385064,
				lng: 2.173403
			},
			zoom: 13

		});
	} catch (err) {
		//when the api doesn't render a map, show the error message
		$('#map').hide();
		$('#map-error').html(
			'<h2>Failed to retrieve Google Maps resources, please try again later.</h2>'
		);
	}

	//Attribution: http://stackoverflow.com/questions/8792676/center-google-maps-v3-on-browser-resize-responsive
	//I used this to keep map centered during resizing window
	var center;

	function calculateCenter() {
		center = map.getCenter();
	}
	google.maps.event.addDomListener(map,
		'idle',
		function() {
			calculateCenter();
		});
	google.maps.event.addDomListener(
		window, 'resize',
		function() {
			console.log("window has resized");
			map.setCenter(center);
		});

	ko.applyBindings(new ViewModel());
}

//this populates the infoWindow for each marker and also calls the wikipedia api to add more info
//to the infoWindow as well as the title of the location
function populateInfoWindow(marker,
	infowindow) {
	if (infowindow.marker != marker) {
		infowindow.marker = marker;

		//Wikipedia API - code idea taken from work done in the Intro to AJAX course
		var wikiUrl =
			'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
			marker.title +
			'&format=json&callback=wikiCallback';

		var wikiRequestTimeout = setTimeout(
			function() {
				infowindow.setContent(
					"failed to get wikipedia resources"
				);
			}, 800);

		$.ajax({
			url: wikiUrl,
			dataType: 'jsonp'
		}).done(function(response) {
			var articleList = response[1];
			for (var i = 0; i < articleList.length; i++) {
				articleStr = articleList[i];
				var url =
					'https://www.wikipedia.org/wiki/' +
					articleStr;
				infowindow.setContent('<div><h3>' +
					marker.title +
					'</h3><p>Wiki Info: <a href="' +
					url + '">' + articleStr +
					'</a></p></div>');
			};

			clearTimeout(wikiRequestTimeout);
		});

		infowindow.open(map, marker);

		infowindow.addListener('closeclick',
			function() {
				infowindow.close();
				marker.setAnimation(null);
			});
	}
}
//hamburger menu functionality from udacity's
//responsive web design fundamentals

var menu = document.querySelector(
	'#menu');
var main = document.querySelector(
	'.main');
var drawer = document.querySelector(
	'#drawer');
var mapView = document.querySelector(
	'#map');

//when the menu icon is clicked, the filter menu slides in
//and the map/menu shift to the right
menu.addEventListener('click', function(
	e) {
	drawer.classList.toggle('open');
	main.classList.toggle('moveRight');
	e.stopPropagation();
});

//when the main area is clicked, including the menu
//the filter menu slides back out
main.addEventListener('click', function() {
	drawer.classList.remove('open');
	main.classList.remove('moveRight');
});