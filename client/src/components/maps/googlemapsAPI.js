import { Loader } from "@googlemaps/js-api-loader";

let directionsService, directionsRenderer;
let mapInstance, infoWindow, markers = [];    // store the instance of the map, information window, initialize markers array
export const googleMapsOperations = {
    
    getLoader: function(apiKey) {
        return new Loader({
            apiKey: apiKey,
            version: "weekly"
            // ...additionalOptions,
        });
    },
    loadGoogleMapsScript: function(loader) {
        return loader.load();  // returns a promise which resolves when the Google Maps script is successfully loaded.
    },

    addMarker: function(lat, lng) {
        const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstance,
            draggable: true, // Allow the marker to be draggable
        });

        // Add a click event listener to open an info window when the marker is clicked
        marker.addListener("click", () => {
            const infoWindow = new window.google.maps.InfoWindow({
                content: `Marker Location: ${lat}, ${lng}`,
            });
            infoWindow.open(mapInstance, marker);
        });

        // Add the marker to the markers array 
        markers.push(marker);
    },

    initalizeMap: function() {
        mapInstance = new window.google.maps.Map(document.getElementById("map"), {  //initializes the map
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
        });
        return mapInstance; // returns the created map instance
    },
    handleLocationError: function(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
            browserHasGeolocation   // sets a corresponding error message to the infoWindow and then opens it on the map
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation.",
        );
        infoWindow.open(mapInstance);
    },
    showCurrentLocation: function() {
        infoWindow = new window.google.maps.InfoWindow();   //initialize the infoWindow instance

        const locationButton = document.createElement("button");    //create new button element
        locationButton.textContent = "Pan to Current Location";
        locationButton.classList.add("custom-map-control-button");
        //button is then added to the top center position of the map controls
        mapInstance.controls[window.google.maps.ControlPosition.TOP_CENTER].push(locationButton);
        locationButton.addEventListener("click", () => {    //event listener when button is clicked
        // Try HTML5 geolocation.
        if (navigator.geolocation) {    
            navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent("Location found.");
            infoWindow.open(mapInstance);
            mapInstance.setCenter(pos);
            },
            () => {
            this.handleLocationError(true, infoWindow, mapInstance.getCenter());
            }
        );
        } else 
            // if browser doesn't support Geolocation
            this.handleLocationError(false, infoWindow, mapInstance.getCenter());
        });
    },
    calculateAndDisplayRoute: function(start, end)
    {
        if (!directionsService) //check if directionsService is initialized
            directionsService = new window.google.maps.DirectionsService();
        if (!directionsRenderer) //check if directionsRenderer is initialized
        {
            directionsRenderer = new window.google.maps.DirectionsRenderer({    //create a new directionsRenderer instance
                map: mapInstance    //associate it with the current active displayed map
            });
        }
        directionsService.route({   //make request to fetch directions
            origin: start,  //starting location
            destination: end,   //end location
            travelMode: window.google.maps.TravelMode.DRIVING,  //transportation type
        }, (response, status) => {      //callback function to handle result of route request
            if (status === "OK") { 
                directionsRenderer.setDirections(response);
                const routeLeg = response.routes[0].legs[0];    //extract distance and time from response
                const distance = routeLeg.distance.text;
                const duration = routeLeg.duration.text;  
                document.getElementById("distance").textContent = `Distance: ${distance} `;  //Display distance
                document.getElementById("duration").textContent = `Duration: ${duration}`;  //display duration
            } else {
                window.alert("Directions request failed due to " + status);
            }
        });
    }
}