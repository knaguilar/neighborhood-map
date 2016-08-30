//Array of initial 5 locations that are set by default
var initialLocations = [
	{
		title: 'Park Güell',
		location: {lat: 41.414495, lng: 2.152695},
		marker: true
	},
	{
		title: 'La Pedrera',
		location: {lat: 41.395247, lng: 2.161683},
		marker: true
	},
	{
		title: 'La Sagrada Família',
		location: {lat: 41.40448, lng: 2.17573},
		marker: true
	},
	{
		title: 'La Barceloneta',
		location: {lat: 41.380894, lng: 2.189385},
		marker: true
	},
	{
		title: 'Parc de la Ciutadella',
		location: {lat: 41.38812, lng: 2.18602},
		marker: true
	},
	{
		title: 'Magic Fountain of Montjuic',
		location: {lat: 41.371182, lng: 2.151671},
		marker: true
	}
	];

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

		this.locationList = ko.observableArray([]);

		//the list that will appear when being filtered by a keyword
		this.filter = ko.observable();

		//looping through each item in initialLocations and
		//adding it to the array
		initialLocations.forEach(function(locationItem){
			self.locationList.push(new Location(locationItem));
		});

		var largeInfoWindow = new google.maps.InfoWindow();
		var bounds = new google.maps.LatLngBounds();

		self.locationList().forEach(function (location) {
		    // define the marker
		    var marker = new google.maps.Marker({
		      map: map,
		      position: location.location,
		      title: location.title,
		      animation: google.maps.Animation.DROP
		    });

		    location.marker = marker;


			//onclick event to open infoWindow
			//Atribution: Udacity's Google Maps APIS Course
			location.marker.addListener('click', function() {
				populateInfoWindow(this, largeInfoWindow);
			});

			location.marker.addListener('click', function(){
				toggleBounce(this);
			});

			bounds.extend(location.marker.position);

		});

		map.fitBounds(bounds);


		// Attribution for filter: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
		this.filteredLocations = ko.computed(function() {
			var filter = self.filter();
		    if (!self.filter()) {
		    	self.locationList().forEach(function (location) {
		    		location.marker.setMap(map);
		    	});
		        return self.locationList();
		    } else {
		        return ko.utils.arrayFilter(self.locationList(), function(loc) {
		    		if(loc.title.toLowerCase().startsWith(filter.toLowerCase())){
		    			loc.marker.setMap(map);
		    		}
		    		else {
		    			loc.marker.setMap(null);
		    		}
		            return loc.title.toLowerCase().startsWith(filter.toLowerCase());
		        });
		    }
		}, self);

		//bounce when location is clicked
		function toggleBounce(marker) {
			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
			} else {
				for (var i = 0; i < self.locationList().length; i++) {
					var mark = self.locationList()[i].marker;
					if(mark.getAnimation() !== null){
						mark.setAnimation(null);
					}
				}
				marker.setAnimation(google.maps.Animation.BOUNCE);
			}
		}

		//initially sets the current location to the first item in
		//locationList
		this.currentLocation = ko.observable(this.locationList()[0]);


		//this is where the location is set once it has been clicked on
		this.setLocation = function(clickedLocation) {
			toggleBounce(clickedLocation.marker);
			populateInfoWindow(clickedLocation.marker, largeInfoWindow);
			self.currentLocation(clickedLocation);
		};
	}

// -------------------------------------------------------------------------------------
	var map;
		// var markers = [];

	function initMap() {
		// Constructor creates a new map - only center and zoom are required.
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 41.385064, lng: 2.173403},
			zoom: 13
		});

		ko.applyBindings(new ViewModel());
	}

	function populateInfoWindow(marker, infowindow){
		if (infowindow.marker != marker) {
			infowindow.marker = marker;
			// infowindow.setContent('<div><h3>' + marker.title + '</h3>');

			//Wikipedia API
			var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';

		    var wikiRequestTimeout = setTimeout(function(){
		        infowindow.setContent("failed to get wikipedia resources");
		    }, 400);

		    $.ajax( {
		    url: wikiUrl,
		    dataType: 'jsonp'}).done(function(response){
		        var articleList = response[1];
		        for (var i = 0; i < articleList.length; i++) {
		            articleStr = articleList[i];
		            var url = 'https://www.wikipedia.org/wiki/' + articleStr;
		            infowindow.setContent('<div><h3>' + marker.title + '</h3><p>Wiki Info: <a href="' + url + '">' + articleStr + '</a></p></div>');
		        };

		        clearTimeout(wikiRequestTimeout);
		    });

			infowindow.open(map, marker);

			infowindow.addListener('closeclick', function(){
				infowindow.close();
				marker.setAnimation(null);
			});
		}
	}
