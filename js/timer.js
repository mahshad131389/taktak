
// Define the duration in seconds
var duration = 120;

// Define the display element
var display = document.getElementById("js-timeout");

// Define a function to update the timer
function updateTimer() {
  // Calculate the minutes and seconds from the duration
  var minutes = Math.floor(duration / 60);
  var seconds = duration % 60;

  // Format the output with leading zeros if needed
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // Display the countdown timer
  display.textContent = minutes + ":" + seconds;

  // Decrease the duration by one second
  duration--;

  // Check if the timer has reached zero
  if (duration < 0) {
    document.getElementById('submit_btn').style.display = 'block';
    // document.getElementById("submit_btn").onclick = "sendreq({{offer.id}})"
    document.getElementById("submit_btn_disabled").style.display = 'none';
    clearInterval(interval);
    duration = 120;
  }
}

// Start the timer by calling the function every second
var interval = setInterval(updateTimer, 1000);