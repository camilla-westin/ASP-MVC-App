var geocoder;
geocoder = new google.maps.Geocoder();
var ouroffice = new google.maps.LatLng(59.326180, 18.072990);
var ourcompany = 'Slottsbacken 6';
var destinationA = 'Stockholm, Sweden';

document.getElementById("address-form").addEventListener('submit', functSubmit);

function functSubmit(event) {
    var address = document.getElementById("address").value.toString();

    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
            var newLat = results[0].geometry.location.lat();
            var newLng = results[0].geometry.location.lng();
            var destinationB = new google.maps.LatLng(newLat, newLng);  
            calculateDistance(destinationB); 
        } else {
            alert('Please enter another address: ' + status);
        }
    });   
}

function calculateDistance(newDestination) {
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [ouroffice, ourcompany],
      destinations: [destinationA, newDestination],
      travelMode: google.maps.TravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.METRIC
    }, callback);
}

function callback(response, status) { 
    if (status == 'OK') {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        var resultItem = document.createElement("li");
        resultItem.innerHTML = '';
        document.getElementById("result-list").appendChild(resultItem);
    
        for (var i = 0; i < origins.length; i++) {
          var results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++)          {
            var element = results[j];
            var distance = element.distance.text;
            var from = origins[i];
            var to = destinations[j];           
          }
        }
        resultItem.innerHTML += 'From ' + from + ' to ' + to + ' it is ' + distance;
    }
}

//To do:
// Sortera resultat efter längd på sträcka
// Skriv instruktioner för att starta app
// Byta ut namn på HelloWorld sidor
// Städa bort skrot i styling (Göm meny osv)
