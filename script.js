// VARIABLES remember the lamp's current state.
let lampIsOn = false;
let currentMode = "reading";
let currentBrightness = "medium";
let timerId = null;
let secondsLeft = 0;
let timerEndTime = null;

// Find the HTML elements that JavaScript needs to change.
const lampStage = document.querySelector(".lamp-stage");
const powerButton = document.querySelector("#powerButton");
const statusText = document.querySelector("#statusText");
const statusDot = document.querySelector("#statusDot");
const previewLabel = document.querySelector("#previewLabel");
const timerButton = document.querySelector("#timerButton");
const timerText = document.querySelector("#timerText");
const demoMode = document.querySelector("#demoMode");
const modeButtons = document.querySelectorAll("[data-mode]");
const brightnessButtons = document.querySelectorAll("[data-brightness]");

// This function redraws the lamp whenever its state changes.
function updateLamp() {
  let lightColor;
  let glowColor;
  let brightnessAmount;

  // IF/ELSE statements choose a color for the selected mode.
  if (currentMode === "reading") {
    lightColor = "#f8fbff";
    glowColor = "rgba(218, 232, 255, 0.95)";
  } else if (currentMode === "sleep") {
    lightColor = "#ffc66d";
    glowColor = "rgba(255, 174, 72, 0.82)";
  } else {
    lightColor = "#ff5d8f";
    glowColor = "rgba(145, 99, 255, 0.78)";
  }

  // Another IF/ELSE statement chooses the brightness strength.
  if (currentBrightness === "low") {
    brightnessAmount = 0.3;
  } else if (currentBrightness === "medium") {
    brightnessAmount = 0.62;
  } else {
    brightnessAmount = 1;
  }

  // The lamp only glows when it is on.
  if (lampIsOn) {
    lampStage.classList.add("on");
    powerButton.classList.add("on");
    powerButton.setAttribute("aria-pressed", "true");
    statusDot.classList.add("on");
    statusText.textContent = capitalize(currentMode) + " · " + capitalize(currentBrightness);
    previewLabel.textContent = currentMode.toUpperCase() + " · " + currentBrightness.toUpperCase();
    document.documentElement.style.setProperty("--lamp-strength", brightnessAmount);
  } else {
    lampStage.classList.remove("on");
    powerButton.classList.remove("on");
    powerButton.setAttribute("aria-pressed", "false");
    statusDot.classList.remove("on");
    statusText.textContent = "Lamp is off";
    previewLabel.textContent = "OFF";
    document.documentElement.style.setProperty("--lamp-strength", 0);
  }

  lampStage.classList.toggle("exercise", currentMode === "exercise");
  document.documentElement.style.setProperty("--lamp-color", lightColor);
  document.documentElement.style.setProperty("--lamp-glow", glowColor);
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// EVENT LISTENER: run this code when the power button is clicked.
powerButton.addEventListener("click", function () {
  lampIsOn = !lampIsOn;
  if (!lampIsOn) stopTimer();
  updateLamp();
});

// Add an event listener to each mode button.
modeButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentMode = button.dataset.mode;
    lampIsOn = true;
    modeButtons.forEach(function (item) { item.classList.remove("active"); });
    button.classList.add("active");
    updateLamp();
  });
});

// Add an event listener to each brightness button.
brightnessButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentBrightness = button.dataset.brightness;
    lampIsOn = true;
    brightnessButtons.forEach(function (item) { item.classList.remove("active"); });
    button.classList.add("active");
    updateLamp();
  });
});

// Start or cancel the automatic shutoff timer.
timerButton.addEventListener("click", function () {
  if (timerId !== null) {
    stopTimer();
  } else {
    lampIsOn = true;
    secondsLeft = demoMode.checked ? 10 : 30 * 60;
    timerEndTime = Date.now() + secondsLeft * 1000;
    updateLamp();
    updateTimerText();
    timerButton.textContent = "Cancel timer";
    timerButton.classList.add("running");

    // Check the real clock instead of assuming every interval is exactly 1 second.
    timerId = setInterval(checkTimer, 250);
  }
});

function checkTimer() {
  const millisecondsLeft = timerEndTime - Date.now();
  secondsLeft = Math.max(0, Math.ceil(millisecondsLeft / 1000));

  if (millisecondsLeft <= 0) {
    finishTimer();
  } else {
    updateTimerText();
  }
}

function finishTimer() {
  // Change the state first, then redraw the lamp in its off state.
  lampIsOn = false;
  stopTimer("Time is up — lamp turned off");
  updateLamp();
}

function updateTimerText() {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  timerText.textContent = "Turns off in " + minutes + ":" + String(seconds).padStart(2, "0");
}

function stopTimer(message) {
  clearInterval(timerId);
  timerId = null;
  timerEndTime = null;
  secondsLeft = 0;
  timerButton.textContent = "Start timer";
  timerButton.classList.remove("running");
  timerText.textContent = message || "Timer is not running";
}

// Draw the starting state when the page loads.
updateLamp();
