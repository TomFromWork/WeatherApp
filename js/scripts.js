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
          $("#temp").html(Math.floor(display.main.temp) + "&deg;C");
          $("#weatherIcon").attr("src", display.weather[0].icon);
          $("#description").html(display.weather[0].description);

          /* Second Box */
          $("#location").html(display.name + ", " + display.sys.country);
          $("#time").html(currentTime);
          $("#date").html(currentDay);

          /* Third Box */
          $("#highLowTemps").html("High: " + display.main.temp_max + " Low: " + display.main.temp_min);
          $("#sunrise").html("Sunrise: " + formattedSunrise);
          $("#sunset").html("Sunset: " + formattedSunset);
          $("#wind").html("Wind: " + degToCompass(display.wind.deg) + " " + display.wind.speed);
        });
    })
  }
});
