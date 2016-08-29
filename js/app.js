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
		title: 'Universitat Autonoma de Barcelona',
		location: {lat: 41.502218 , lng: 2.104217},
		marker: true
	},
	{
		title: 'La Barceloneta',
		location: {lat: 41.380894, lng: 2.189385},
		marker: true
	},
	{
		title: 'Font Màgica de Montjuïc',
		location: {lat: 41.371182, lng: 2.151671},
		marker: true
	}
	];

	// Each location on the List has two main properties that can be accessed -
	// title and location
	var Location = function(data) {
		this.title = ko.observable(data.title);
		this.location = ko.observable(data.location);
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

		// Attribution for filter: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
		this.filteredLocations = ko.computed(function() {
			var filter = self.filter();
		    if (!self.filter()) {
		        return self.locationList();
		    } else {
		        return ko.utils.arrayFilter(self.locationList(), function(loc) {
		            return loc.title().toLowerCase().startsWith(filter.toLowerCase());
		        });
		    }
		}, self);

		//initially sets the current location to the first item in
		//locationList
		this.currentLocation = ko.observable(this.locationList()[0]);

		//this is where the location is set once it has been clicked on
		this.setLocation = function(clickedLocation) {
			self.currentLocation(clickedLocation);
		};
	}

	ko.applyBindings(new ViewModel());