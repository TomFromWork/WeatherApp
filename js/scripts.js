$(document).ready(function() {

  var dt = new Date();
  var currentDay = dt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  var currentTime = dt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  /* Convert wind angle to compass direction */
  function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      $.getJSON("https://fcc-weather-api.glitch.me/api/current?" +
        "lon=" + longitude + "&lat=" + latitude,
        function(display) {
          console.log(display);

          /* Convert celsius to fehrenheit */
          var fahrenheit = Math.floor((display.main.temp * 9/5) + 32);
          /* convert wind kph to mph */
          var mph = Math.round(10*display.wind.speed/1.609344)/10;

          /* Sunrise code */
          var sunrise = new Date(display.sys.sunrise * 1000);
          var formattedSunrise = sunrise.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
          });

          /* Sunset Code */
          var sunset = new Date(display.sys.sunset * 1000);
          var formattedSunset = sunset.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
          });

          /* First Box */
          $("#description").html(display.weather[0].description);
          $("#location").html(display.name + ", " + display.sys.country);
          
          /* Second Box */
          $("#temp").html(Math.floor(display.main.temp) + "&deg;C");
          $("#weatherIcon").attr("src", display.weather[0].icon);

          /* Third Box */
          $("#pressure").html("Pressure: " + display.main.pressure);
          $("#sunrise").html("Sunrise: " + formattedSunrise);
          $("#sunset").html("Sunset: " + formattedSunset);
          $("#wind").html("Wind: " + degToCompass(display.wind.deg) + " " + display.wind.speed + " KPH");

          /* Toggleswitch for temp conversion */
          $("input").change(function() {
            if($("#conversion").prop("checked")) {
              $("#temp").html(fahrenheit + "&deg;F");
              $("#wind").html("Wind: " + degToCompass(display.wind.deg) + " " + mph + " MPH");
            } else {
              $("#temp").html(Math.floor(display.main.temp) + "&deg;C");
              $("#wind").html("Wind: " + degToCompass(display.wind.deg) + " " + display.wind.speed + " KPH");
            }
          })
        });
    })
  }
});
