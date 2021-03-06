var geocoder = new google.maps.Geocoder();
var ouroffice = new google.maps.LatLng(59.334798, 18.0628005);
var companyname = 'Comprend';
var companyaddress = 'Sveavägen 20';
var destinationA = 'Stockholm, Sweden';
var resultsArray = [];

function functSubmit(event) {
    // Get value from form and store to variable
    var address = document.getElementById("address").value.toString();

    // Get information about address from google maps geocode api
    geocoder.geocode( { 'address': address}, function(results, status) { 
        if (status == 'OK') {
            //Get latitude and longitude from address and store in variables
            var newLat = results[0].geometry.location.lat();
            var newLng = results[0].geometry.location.lng();

            // Update destinationB variable with new lat lng information
            var destinationB = new google.maps.LatLng(newLat, newLng);  

            calculateDistance(destinationB); 
        } else {
            alert('Please enter another address.');
            console.log(status);
        }
    });   
}

// Get distance information about new destination from google maps Distance Matrix api
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

        // Create new object with information everytime user submits new address
        var gmObject = {
            element: element,
            distanceInt: parseInt(distance), //TODO: Här vill man få med decimaler för en mer exakt sortering
            distance: distance,
            from: from,
            to: to
        }

        //Push new object in to array
        resultsArray.push(gmObject);

        //Function to display all results in the array
        function displayResultList(resultsArray) {
            resultsArray.forEach(function (gmObject) {
                resultItem.innerHTML += '<li><span class="highlight">From:</span> ' + companyname + ' ' + gmObject.from + '<br /><span class="highlight">To:</span> ' + gmObject.to + '<br /><br /> <span class="highlight">Walking distance:</span> ' + '<strong>' + gmObject.distance + '</strong></li>';
            });
        }

        //Sort objects by distance in ascending order
        resultsArray.sort(function (x, y) {
            return x.distanceInt - y.distanceInt;
        });

        displayResultList(resultsArray);

    } else {
        console.log(status);
    }
}

//Call submit function on button click
document.getElementById("address-form").addEventListener('submit', functSubmit);