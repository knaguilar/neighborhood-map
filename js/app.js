//Array of initial 5 locations that are set by default
var initialLocations = [
	{
		title: 'Park Güell',
		location: {lat: 41.414495, lng: 2.152695}
	},
	{
		title: 'La Pedrera',
		location: {lat: 41.395247, lng: 2.161683}
	},
	{
		title: 'Universitat Autonoma de Barcelona',
		location: {lat: 41.502218 , lng: 2.104217}},
	{
		title: 'La Barceloneta',
		location: {lat: 41.380894, lng: 2.189385}},
	{
		title: 'Font Màgica de Montjuïc',
		location: {lat: 41.371182, lng: 2.151671}}
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

		//looping through each item in initialLocations and
		//adding it to the array
		initialLocations.forEach(function(locationItem){
			self.locationList.push(new Location(locationItem));
		});

		//initially sets the current location to the first item in
		//locationList
		this.currentLocation = ko.observable(this.locationList()[0]);

		//this is where the location is set once it has been clicked on
		this.setLocation = function(clickedLocation) {
			self.currentLocation(clickedLocation);
		};


	}

	ko.applyBindings(new ViewModel());