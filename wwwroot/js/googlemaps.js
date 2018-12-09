var geocoder = new google.maps.Geocoder();
var ouroffice = new google.maps.LatLng(59.326180, 18.072990);
var companyname = 'Ted & Gustaf';
var companyaddress = 'Slottsbacken 6';
var destinationA = 'Stockholm, Sweden';
var resultsArray = [];

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
            alert('Please enter another address.');
            console.log(status);
        }
    });   
}

function calculateDistance(newDestination) {
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [ouroffice, companyaddress],
      destinations: [destinationA, newDestination],
      travelMode: google.maps.TravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.METRIC
    }, callback);
}

function callback(response, status) { 
    if (status == 'OK') {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        var resultItem = document.getElementById("result-list");
        resultItem.innerHTML = '';
    
        for (var i = 0; i < origins.length; i++) {
          var results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++)          {
            var element = results[j];
            var distance = element.distance.text;
            var from = origins[i];
            var to = destinations[j];           
          }
        }

        var gmObject = {
            element: element,
            distanceInt: parseInt(distance), //Här vill man få med decimaler för en mer exakt sortering
            distance: distance,
            from: from,
            to: to
        }

        resultsArray.push(gmObject);

        function displayResultList(resultsArray) {
            resultsArray.forEach(function (gmObject) {
                resultItem.innerHTML += '<li><span class="highlight">From:</span> ' + companyname + ' ' + gmObject.from + '<br /><span class="highlight">To:</span> ' + gmObject.to + '<br /><br /> <span class="highlight">Walking distance:</span> ' + '<strong>' + gmObject.distance + '</strong></li>';
            });
        }

        resultsArray.sort(function (x, y) {
            return x.distanceInt - y.distanceInt;
        });

        displayResultList(resultsArray);

    } else {
        console.log(status);
    }
}