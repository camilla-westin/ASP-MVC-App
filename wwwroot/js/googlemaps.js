
document.getElementById("address-form").addEventListener('submit', functSubmit);

function functSubmit(event) {
    var address = document.getElementById("address").value.toString();
    console.log(address); 
}

var ouroffice = new google.maps.LatLng(59.326180, 18.072990);
var origin2 = 'Slottsbacken 6';
var destinationA = 'Stockholm, Sweden';
var destinationB = new google.maps.LatLng(59.334591, 18.063240);
var button = document.getElementById('searchbutton');

function calculateDistance() {
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [ouroffice, origin2],
      destinations: [destinationA, destinationB],
      travelMode: google.maps.TravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, callback);
}

function callback(response, status) { 
    if (status == 'OK') {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        var outputDiv = document.getElementById('result');
        outputDiv.innerHTML = ' ';
    
        for (var i = 0; i < origins.length; i++) {
          var results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++)          {
            var element = results[j];
            var distance = element.distance.text;
            var duration = element.duration.text;
            var from = origins[i];
            var to = destinations[j];           
          }
        }
        outputDiv.innerHTML += 'From ' + from + ' to ' + to + ' it is ' + distance;
    }
}

button.addEventListener('click', function(event) {
  calculateDistance();
}, true);


