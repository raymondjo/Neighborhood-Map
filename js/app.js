
function wakeUp() {

	ko.applyBindings(new ViewModel());
}
///////////////////////////////////////////////////////////////////////////////
////////////////////*********Model********////////////////////////////////////
var Model = [
	{
		title: 'Egyptian Museum',
		lat: 30.0478,
		lng: 31.2336,
		id: 1
		},
    {
      title:'Al Ahly Club',
      lat: 30.0434624,
  		lng: 31.2211489,
    },
	{
		title: 'Tahrir Square',
		lat: 30.0445,
		lng: 31.2356,
		id: 2
		},
	{
		title: 'Cairo Opera House',
		lat: 30.0427,
		lng: 31.2240,
		id: 3
		},
	{
		title: 'Manial Palace and Museum',
		lat: 30.0274,
		lng: 31.2290,
		id: 4
		},
	{
		title: 'Café Riche',
		lat: 30.0472,
		lng: 31.2384,
		id: 5
		},
	{
		title: 'Abdeen Palacee',
		lat: 30.0430,
		lng: 31.2478,
		id: 6
		},
	{
		title: 'Cairo Tower',
		lat: 30.0459,
		lng: 31.2243,
		id: 7
		}
];

//////////////////////////////////////////////////////////////////////////////

//Global Variables
var map ;
var popupwindow = null;
markers = ko.observableArray();
textsearch = ko.observable("");
currentList = ko.observableArray();

function ViewModel() {

	var self = this;

	this.refreshFilterList = function () {
		tempList = [];

		markers().forEach(function (marker, i) {
		    marker.setMap(null);
		});

		for (i in Model ) {
			if (Model[i].title.toLowerCase().includes(textsearch().toLowerCase())) {
				//console.log(Model[i]);
				tempList.push(Model[i]);
				 insertMarker(Model[i]);
			}
		}
		//console.log(tempList);
		currentList(tempList);
		};

		function insertMarker(current){
			if(!current.marker){

				current.marker = new google.maps.Marker({
						map: map,
						position: {
                        lat: current.lat,
                        lng: current.lng
                    }

				});

				current.marker.addListener('click', function() {
					self.popup(current);
				});
			} else {
				current.marker.setMap(map);
			}

			markers().push(current.marker);

		}


	self.popup = function(position) {

		if (popupwindow !== null) {
		    popupwindow.close();
		}

		position.infoWindow = new google.maps.InfoWindow({
	   content: wikipediaInformation(position)
		});

		popupwindow = position.infoWindow;

		popupwindow.open(map, position.marker);

		position.marker.setAnimation(google.maps.Animation.DROP);
		setTimeout((function() {
				position.marker.setAnimation(null);
		}).bind(position.marker), 1000);


	};



	function wikipediaInformation(position) {

			var wikipediaUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
			                   + position.title + '&format=json';

			$.ajax({
					url: wikipediaUrl,
					dataType: 'jsonp',
					success: function(response) {
						//console.log(response);
						if (response[2][0] !== undefined) {

							var temp = '<h1>'+response[0] +'</h1>';
							//console.log(response[0]);

							temp += '<br> <h5> wikipedia: </h5><br><p>' + response[2][0] + '</p>';
							if (response[3][0]){
								temp += '<a href="'+response[3][0]+'"> wikipedia link </a>';
							}
							position.infoWindow.setContent(temp);
						}
						else {
							var temp = '<h1>'+response[0] +'</h1>';
						//	console.log(response[0]);
							var message = "No wikipedia info found for this stadium";
							temp += '<br> <h5> wikipedia </h5><p>' + message + '</p>';
						  position.infoWindow.setContent(temp);
						}
					},
					error: function() {
							alert("Get information from Wikipedia is Failed to load");
					}
			});

	};

	 function establishMap () {

		map = new google.maps.Map(document.getElementById('map'), {
			center: {
							lat:30.0445,
				 			lng: 31.2356},
			zoom: 14,
			styles:[{"stylers":[{"visibility":"simplified"}]},{"stylers":[{"color":"#131314"}]},{"featureType":"water","stylers":[{"color":"#131313"},{"lightness":7}]},{"elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"lightness":25}]}]
		});

		tempList = [];
		markers().forEach(function (pos, i) {
		    pos.setMap(null);
		});
		for (i in Model ) {
			if (Model[i].title.toLowerCase().includes(textsearch().toLowerCase())) {
				tempList.push(Model[i]);
				 insertMarker(Model[i]);
			}
		}
		currentList(tempList);
		//console.log(currentList());
	};
	establishMap();

}//the end of view Model

//error function if there is error in google map API
function Error() {
					const MAP_ERROR_MESSAGE = `<h3>Problem retrieving Map Data. Please reload the page to retry!</h3>`;
					document.getElementById('error').style.display = 'block';
					document.getElementById('error').innerHTML = MAP_ERROR_MESSAGE;
			}
