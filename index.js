const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const text = canvas.getContext("2d");
let dragOffsetX = 0;
let dragOffsetY = 0;

const howtoplay = document.getElementById("howtoplay");
const confimBtn = document.getElementById("confimBtn");

let timerElement = document.getElementById("timer");
let elapsedTime = 0;
let timerInterval = null;
let isPaused = false;
let time = 0;
let firstDragStarted = false;

let rightAttempts = 0;
let wrongAttempts = 0;

// Function to update the attempt counts in the UI
const rightAttemptsElement = document.getElementById("rightAttempts");
const wrongAttemptsElement = document.getElementById("wrongAttempts");
function updateAttemptsUI() {
  rightAttemptsElement.innerHTML = rightAttempts;
  wrongAttemptsElement.innerHTML = wrongAttempts;
}

function showPopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("hidden");
}

function restartGame() {
  const popup = document.getElementById("popup");
  popup.classList.add("hidden");
  rightAttemptsElement.innerHTML = 0;
  wrongAttemptsElement.innerHTML = 0;
  resetGame();
  resetTimer();
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("hidden");
}

document.getElementById("restartButton").addEventListener("click", restartGame);
document.getElementById("closeButton").addEventListener("click", closePopup);

const labels = [
  {
    text: "ROOT",
    x: 750,
    y: 160,
    startX: 750,
    startY: 160,
    targetX: 108,
    targetY: 480,
    isPlaced: false,
    buttonX: 680,
    buttonY: 140,
    showButton: true,
  },
  {
    text: "STEM",
    x: 750,
    y: 210,
    startX: 750,
    startY: 210,
    targetX: 488,
    targetY: 401,
    isPlaced: false,
    buttonX: 680,
    buttonY: 190,
    showButton: true,
  },
  {
    text: "LEAF",
    x: 750,
    y: 260,
    startX: 750,
    startY: 260,
    targetX: 77,
    targetY: 211,
    isPlaced: false,
    buttonX: 680,
    buttonY: 240,
    showButton: true,
  },
  {
    text: "FLOWER",
    x: 750,
    y: 310,
    startX: 750,
    startY: 310,
    targetX: 477,
    targetY: 221,
    isPlaced: false,
    buttonX: 680,
    buttonY: 291,
    showButton: true,
  },
  {
    text: "FRUIT",
    x: 750,
    y: 360,
    startX: 750,
    startY: 360,
    targetX: 66,
    targetY: 286,
    isPlaced: false,
    buttonX: 680,
    buttonY: 341,
    showButton: true,
  },
  {
    text: "BUD",
    x: 750,
    y: 410,
    startX: 750,
    startY: 410,
    targetX: 480,
    targetY: 139,
    isPlaced: false,
    buttonX: 680,
    buttonY: 391,
    showButton: true,
  },
];

// Function to start the timer
function startTimer() {
  if (!timerInterval && !isPaused) {
    firstDragStarted = true;
    timerInterval = setInterval(() => {
      time++;
      updateTimerDisplay();
    }, 1000);
  }
}

// Function to pause the timer
function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = true;
  }
}

// Function to resume the timer
function resumeTimer() {
  if (isPaused) {
    isPaused = false;
    startTimer(); // Resumes the timer
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  time = 0;
  firstDragStarted = false;
  isPaused = false;
  updateTimerDisplay();
}

// Function to stop the timer
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay() {
  let minutes = String(Math.floor(time / 60)).padStart(2, "0");
  let seconds = String(time % 60).padStart(2, "0");
  timerElement.innerHTML = `${minutes}:${seconds}`;
}

// Function to check if all labels are placed correctly
function checkCompletion(labels) {
  if (labels.every((label) => label.isPlaced)) {
    stopTimer();
  }
}

// Function to reset the timer
function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval); // Stop any running timer
    timerInterval = null;
  }
  time = 0; // Reset time to 0
  timerElement.innerHTML = "00:00"; // Update the timer display
  firstDragStarted = false; // Allow the timer to start again
}

const pauseGamePopUp = document
  .getElementById("pauseBtn")
  .addEventListener("click", pauseGame);
const resumeGamePopUp = document
  .getElementById("resumeBtn")
  .addEventListener("click", resumeGame);
// Function to pause the game
function pauseGame() {
  isPaused = true;
  clearInterval(timerInterval); // Stop the timer
  showPausePopup(); // Show the pause popup
  pauseTimer();
}

// Function to resume the game
function resumeGame() {
  isPaused = false;
  resumeTimer(); // Resume the timer
  hidePausePopup(); // Hide the pause popup
  drawGame(); // Redraw the game
}

// Show pause popup
function showPausePopup() {
  console.log("Click hua showPausePopup");
  const pausePopup = document.getElementById("pausePopup");
  pausePopup.classList.remove("hidden");
}

// Hide pause popup
function hidePausePopup() {
  const pausePopup = document.getElementById("pausePopup");
  pausePopup.classList.add("hidden");
}

let draggingLabel = null;

const plantImage = new Image();
plantImage.src = "plant.png";
const soundButtonImage = new Image();
soundButtonImage.src = "sound.png";

plantImage.onload = () => drawGame();
soundButtonImage.onload = () => drawGame();

function drawTextWithSpacing(text, x, y, spacing) {
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";

  let startX = x;
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], startX, y);
    startX += ctx.measureText(text[i]).width + spacing;
  }
}

function drawTextOnRedBox() {
  text.fillStyle = "black";
  text.font = "18px Arial";
  //   text.textAlign = "center";

  const redBoxX = 250;
  const redBoxY = 30;
  text.fillText(
    "Drag and drop the words in the box to label the picture.",
    redBoxX,
    redBoxY
  );
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(plantImage, 45, 76, 625, 465);

  drawTextOnRedBox();

  labels.forEach((label) => {
    if (draggingLabel === label) {
      ctx.fillStyle = "transparent";
    } else if (label.isPlaced) {
      ctx.fillStyle = "transparent";
    } else {
      ctx.fillStyle = "transparent";
    }

    ctx.fillRect(label.x - 5, label.y - 25, 80, 40);
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";

    if (draggingLabel === label || label.isPlaced) {
      drawTextWithSpacing(label.text, label.x, label.y, 20);
    } else {
      ctx.fillText(label.text, label.x, label.y);
    }

    if (label.showButton) {
      ctx.drawImage(soundButtonImage, label.buttonX, label.buttonY, 24, 24);
    }
  });

  if (labels.every((label) => label.isPlaced)) {
    // showPopup();
    setTimeout(() => {
      showPopup();
    }, 2000);
  }
}

function isInsideLabel(x, y, label) {
  return (
    x > label.x - 10 && x < label.x + 70 && y > label.y - 20 && y < label.y + 20
  );
}

function getEventCoordinates(e) {
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX - canvas.offsetLeft,
      y: e.touches[0].clientY - canvas.offsetTop,
    };
  }
  return { x: e.offsetX, y: e.offsetY };
}

// canvas.addEventListener("mousedown", (e) => handleStart(e));
canvas.addEventListener("mousedown", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  draggingLabel = labels.find(
    (label) => isInsideLabel(mouseX, mouseY, label) && !label.isPlaced
  );

  if (draggingLabel) {
    dragOffsetX = mouseX - draggingLabel.x;
    dragOffsetY = mouseY - draggingLabel.y;
    console.log(`Dragging started on label: ${draggingLabel.text}`);
    startTimer(); // Start the timer on the first drag
  }
});

canvas.addEventListener("touchstart", (e) => handleStart(e));
function handleStart(e) {
  const { x, y } = getEventCoordinates(e);

  labels.forEach((label) => {
    if (
      label.showButton &&
      x > label.buttonX &&
      x < label.buttonX + 20 &&
      y > label.buttonY &&
      y < label.buttonY + 20
    ) {
      speakLabel(label.text);
    }
  });

  draggingLabel = labels.find(
    (label) => isInsideLabel(x, y, label) && !label.isPlaced
  );
  e.preventDefault();
}

// canvas.addEventListener("mousemove", (e) => handleMove(e));
canvas.addEventListener("mousemove", (e) => {
  if (draggingLabel) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    draggingLabel.x = mouseX - dragOffsetX;
    draggingLabel.y = mouseY - dragOffsetY;

    drawGame();
  }
});

canvas.addEventListener("touchmove", (e) => handleMove(e));
function handleMove(e) {
  if (isPaused) return;
  if (draggingLabel) {
    const { x, y } = getEventCoordinates(e);
    draggingLabel.x = x;
    draggingLabel.y = y;
    drawGame();
    e.preventDefault();
  }
}

canvas.addEventListener("mouseup", () => handleEnd());
canvas.addEventListener("touchend", () => handleEnd());
function handleEnd() {
  if (isPaused) return;
  if (draggingLabel) {
    const { targetX, targetY, startX, startY, text } = draggingLabel;

    if (
      Math.abs(draggingLabel.x - targetX) < 20 &&
      Math.abs(draggingLabel.y - targetY) < 20
    ) {
      draggingLabel.x = targetX;
      draggingLabel.y = targetY;
      draggingLabel.isPlaced = true;
      draggingLabel.showButton = false;
      speakLabel(text);

      rightAttempts++;
    } else {
      draggingLabel.x = startX;
      draggingLabel.y = startY;
      draggingLabel.isPlaced = false;
      wrongAttempts++;
    }
    checkCompletion(labels);
    draggingLabel = null;
    drawGame();
    updateAttemptsUI();
  }
}

function speakLabel(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find((voice) =>
    voice.name.toLowerCase().includes("female")
  );

  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function resetGame() {
  labels.forEach((label) => {
    label.x = label.startX;
    label.y = label.startY;
    label.isPlaced = false;
    label.showButton = true;
  });
  drawGame();
}

// Create the audio object for background sound
const backgroundSound = new Audio("bgAudio.mpeg");
let isPlaying = true;
const toggleButton = document.getElementById("toggleButton");
// Set the sound to loop
backgroundSound.loop = true;
backgroundSound.volume = 1; // Set the volume (0 to 1)

// Function to play the sound
function playBackgroundSound() {
  backgroundSound.play().catch((error) => {
    isPlaying = false;
    toggleButton.innerText = "Pause🔈";
    console.warn("Autoplay is blocked. Waiting for user interaction.");
  });
}

// Automatically play the background sound when the page loads
window.onload = () => {
  playBackgroundSound();
};

// Add an optional event to start sound if autoplay is blocked
// document.addEventListener("click", () => {
//   if (backgroundSound.paused) {
//     playBackgroundSound();
//   }
// });

// Get the toggle button

// Set an initial state for the music
// Set to true since it should play on page load

// Update the button text based on the initial state
toggleButton.innerText = "🔊"; // Change button text to Pause because the music is playing

// Add a click event listener to the button
toggleButton.addEventListener("click", () => {
  if (isPlaying) {
    backgroundSound.pause();
    toggleButton.innerText = "🔈"; // Change button text to Play
  } else {
    backgroundSound.play().catch((error) => {
      console.warn("Autoplay is blocked. Waiting for user interaction.");
    });
    toggleButton.innerText = "🔊"; // Change button text to Pause
  }
  isPlaying = !isPlaying; // Toggle the state
});

function hideHowToPlay() {
  howtoplay.classList.add("hidden");
  console.log("click hua", howtoplay);
  backgroundSound.play().catch((error) => {
    console.warn("Autoplay is blocked. Waiting for user interaction.");
  });
  toggleButton.innerText = "🔊";
}

confimBtn.addEventListener("click", hideHowToPlay);
