function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}
function initMap() {
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow();
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: 50.850610, lng: 4.351009},


      styles: [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    }
]
    });
    
    badImage = 'img/bad.png';
    goodImage = 'img/good.png';
    sosImage = 'img/sos.png';
    unkownImage = 'img/unkown.png';
    markers = []
    
    
    filter = ["SOS SIGNAL", "BAD FEEDBACK", "GOOD FEEDBACK"]

    $("[type='checkbox']").map((key, element) => {
        $(element).click(() => {
            if ($(element).prop("checked")) {
                filter.push($(element).get(0).value)
            } else {
                index = filter.indexOf($(element).get(0).value)
                if (index > -1) {
                    filter.splice(index, 1)
                }
            }
        })
        filterData()    

    })

    
    function filterData(){
        markers.map((marker, key) => {
            marker.setVisible(false)

        })
        filter.map((feedback, key) => {
            markers.map((marker, key) => {
                if (feedback == marker.category) {
                    marker.setVisible(true)
                }
            })
        })
    }

    $.getJSON( "data.json", function( data ) {
        data.map(reg => {
            if (reg.feedback == "SOS SIGNAL") {
                image = sosImage
                animation = google.maps.Animation.BOUNCE
                className = "sos"
            } else if (reg.feedback == "BAD FEEDBACK") {
                image = badImage
                animation = google.maps.Animation.DROP
                className = "bad"
            } else if (reg.feedback == "GOOD FEEDBACK") {
                image = goodImage
                animation = false
                className = "good"
            } else {
                image = unkownImage
                animation = false
            }

            feedbackMarker = new google.maps.Marker({
                position: {lat: reg.location.lat[0], lng: reg.location.lng[0]},
                map: map,
                icon: image,
                animation: animation,
                category: reg.feedback
                });
            
            markers.push(feedbackMarker)

            google.maps.event.addListener(feedbackMarker, 'click', function(event) {
                geocoder.geocode({'location': {lat: event.latLng.lat(), lng: event.latLng.lng()}}, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        address = results[0].formatted_address
                    } else {
                        address = 'unkown'
                    }
                    infowindow.setContent(`<div><h2>${reg.feedback}</h2><b>User ID: ${reg.user_id}</b><p><b>Location: </b>lat:${reg.location.lat},lng:${reg.location.lng}</p><p>${address}</p><p>${reg.description}</p><p><b>${timeConverter(reg.time)}</b></p><img width="320px" src="${reg.photo}"><h3>Sensors</h3><p><b>Light Sensor: </b>${reg.sensors.light_sensor}</p><p><b>Ultrasonic Sensor: </b>${reg.sensors.ultrasonic_sensor}</p><p><b>Accelerometer: </b>${reg.sensors.accelerometer}</p></div>`);
                    infowindow.open(map, this);
                })
            });
            
        });
    })

};