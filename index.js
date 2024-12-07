const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
    buttonY: 140, // Sound button coordinates
    showButton: true, // Track if the sound button should be displayed
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

let draggingLabel = null;

const plantImage = new Image();
plantImage.src = "plant.png";
const soundButtonImage = new Image();
soundButtonImage.src = "sound.png";

plantImage.onload = () => drawGame();
soundButtonImage.onload = () => drawGame();

// Function to draw text with letter-spacing
function drawTextWithSpacing(text, x, y, spacing) {
  ctx.fillStyle = "black"; // Text color
  ctx.font = "16px Arial"; // Text font size

  let startX = x;
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], startX, y); // Draw each character
    startX += ctx.measureText(text[i]).width + spacing; // Adjust position based on letter width + spacing
  }
}

// Draw the game state
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(plantImage, 45, 76, 625, 465);

  labels.forEach((label) => {
    if (draggingLabel === label) {
      ctx.fillStyle = "transparent"; // Transparent background when dragging
    } else if (label.isPlaced) {
      ctx.fillStyle = "transparent"; // Transparent background when placed
    } else {
      ctx.fillStyle = "transparent"; // Default background color
    }

    // Draw the label background
    ctx.fillRect(label.x - 5, label.y - 25, 80, 40);
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    // Apply letter-spacing if the label is being dragged or placed at the target
    if (draggingLabel === label || label.isPlaced) {
      drawTextWithSpacing(label.text, label.x, label.y, 20); // 20px letter-spacing
    } else {
      ctx.fillText(label.text, label.x, label.y); // Default text rendering without letter-spacing
    }

    // Draw the sound button if the label hasn't been placed
    if (label.showButton) {
      ctx.drawImage(soundButtonImage, label.buttonX, label.buttonY, 24, 24);
    }
  });
}

// Check if a point is inside a label's bounding box
function isInsideLabel(x, y, label) {
  return (
    x > label.x - 10 && x < label.x + 70 && y > label.y - 20 && y < label.y + 20
  );
}

// Utility function to get the correct coordinates from mouse or touch events
function getEventCoordinates(e) {
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX - canvas.offsetLeft,
      y: e.touches[0].clientY - canvas.offsetTop,
    };
  }
  return { x: e.offsetX, y: e.offsetY };
}

// Handle mouse and touch start
canvas.addEventListener("mousedown", (e) => handleStart(e));
canvas.addEventListener("touchstart", (e) => handleStart(e));
function handleStart(e) {
  const { x, y } = getEventCoordinates(e);

  // Check if clicking a sound button
  labels.forEach((label) => {
    if (
      label.showButton &&
      x > label.buttonX &&
      x < label.buttonX + 20 &&
      y > label.buttonY &&
      y < label.buttonY + 20
    ) {
      speakLabel(label.text); // Speak the label's text
    }
  });

  draggingLabel = labels.find(
    (label) => isInsideLabel(x, y, label) && !label.isPlaced
  );
  e.preventDefault();
}

// Handle mouse and touch move
canvas.addEventListener("mousemove", (e) => handleMove(e));
canvas.addEventListener("touchmove", (e) => handleMove(e));
function handleMove(e) {
  if (draggingLabel) {
    const { x, y } = getEventCoordinates(e);
    draggingLabel.x = x;
    draggingLabel.y = y;
    drawGame();
    e.preventDefault();
  }
}

// Handle mouse and touch end
canvas.addEventListener("mouseup", () => handleEnd());
canvas.addEventListener("touchend", () => handleEnd());
function handleEnd() {
  if (draggingLabel) {
    const { targetX, targetY, startX, startY, text } = draggingLabel;

    // Check if the label is dropped close enough to the target position
    if (
      Math.abs(draggingLabel.x - targetX) < 20 &&
      Math.abs(draggingLabel.y - targetY) < 20
    ) {
      draggingLabel.x = targetX;
      draggingLabel.y = targetY;
      draggingLabel.isPlaced = true;
      draggingLabel.showButton = false; // Remove sound button
      speakLabel(text);
    } else {
      draggingLabel.x = startX;
      draggingLabel.y = startY;
      draggingLabel.isPlaced = false;
    }

    draggingLabel = null;
    drawGame();
  }
}

// Function to speak a label's text
function speakLabel(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();

  //   const femaleVoice = voices.find((voice) =>
  //     voice.name.toLowerCase().includes("female")
  //   );

  //   if (femaleVoice) {
  //     utterance.voice = femaleVoice;
  //   }

  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

// Reset the game
function resetGame() {
  labels.forEach((label) => {
    label.x = label.startX;
    label.y = label.startY;
    label.isPlaced = false;
    label.showButton = true; // Restore sound button
  });
  drawGame();
}
