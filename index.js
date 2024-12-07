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
    buttonY: 140, // Track if the word is placed at the target
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
  },
];

let draggingLabel = null;

const plantImage = new Image();
plantImage.src = "plant.png"; // Add the path to the image file
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
      ctx.fillStyle = "transparent"; // Change background to yellow when dragging
    } else if (label.isPlaced) {
      ctx.fillStyle = "transparent"; // Change background to green when placed correctly
    } else {
      //   ctx.fillStyle = "lightblue"; // Default background color
      ctx.fillStyle = "transparent"; // Default background color
    }

    // Draw the label background
    ctx.fillRect(label.x - 5, label.y - 25, 80, 40);
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    // Apply letter-spacing if the label is being dragged or placed at the target
    if (draggingLabel === label || label.isPlaced) {
      drawTextWithSpacing(label.text, label.x, label.y, 20); // 12px letter-spacing
    } else {
      ctx.fillText(label.text, label.x, label.y); // Default text rendering without letter-spacing
    }
    // Draw the sound button
    ctx.drawImage(soundButtonImage, label.buttonX, label.buttonY, 24, 24);
  });
}

// Check if a point is inside a label's bounding box
function isInsideLabel(x, y, label) {
  return (
    x > label.x - 10 && x < label.x + 70 && y > label.y - 20 && y < label.y + 20
  );
}

// Handle mouse events
canvas.addEventListener("mousedown", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  // Check if clicking a sound button
  labels.forEach((label) => {
    if (
      mouseX > label.buttonX &&
      mouseX < label.buttonX + 20 &&
      mouseY > label.buttonY &&
      mouseY < label.buttonY + 20
    ) {
      speakLabel(label.text); // Speak the label's text
    }
  });

  console.log(`Mouse Down: (${mouseX}, ${mouseY})`); // Log mouse position on click

  draggingLabel = labels.find(
    (label) => isInsideLabel(mouseX, mouseY, label) && !label.isPlaced
  );
  if (draggingLabel) {
    console.log(`Dragging started on label: ${draggingLabel.text}`);
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (draggingLabel) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    console.log(`Mouse Move: (${mouseX}, ${mouseY})`); // Log mouse position during drag

    draggingLabel.x = mouseX;
    draggingLabel.y = mouseY;
    drawGame();
  }
});

canvas.addEventListener("mouseup", () => {
  if (draggingLabel) {
    const { targetX, targetY, startX, startY, text } = draggingLabel;

    console.log(`Mouse Up at: (${draggingLabel.x}, ${draggingLabel.y})`);

    // Check if the label is dropped close enough to the target position
    if (
      Math.abs(draggingLabel.x - targetX) < 20 &&
      Math.abs(draggingLabel.y - targetY) < 20
    ) {
      draggingLabel.x = targetX;
      draggingLabel.y = targetY;
      draggingLabel.isPlaced = true; // Mark as placed
      draggingLabel.backgroundColor = "green"; // Change background color to green
      speakLabel(text);
    } else {
      draggingLabel.x = startX;
      draggingLabel.y = startY;
      draggingLabel.isPlaced = false; // Reset placed flag
      draggingLabel.backgroundColor = "lightblue"; // Reset background color if not placed correctly
    }

    draggingLabel = null;
    drawGame();
  }
});

// Function to speak a label's text
// function speakLabel(text) {

//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.lang = "en-US";
//   speechSynthesis.speak(utterance);
// }

function speakLabel(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();

  // Find a female voice
  const femaleVoice = voices.find((voice) =>
    voice.name.toLowerCase().includes("female")
  );

  // Set the female voice if available
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  utterance.lang = "en-US"; // Set language (modify if needed)
  speechSynthesis.speak(utterance);
}

// Function to handle mouseover and mouseout events to simulate letter spacing on hover
canvas.addEventListener("mousemove", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  labels.forEach((label) => {
    if (isInsideLabel(mouseX, mouseY, label)) {
      document.body.style.cursor = "pointer"; // Change cursor to indicate hover
    } else {
      document.body.style.cursor = "default"; // Reset cursor to default
    }
  });
});

// Reset the game
function resetGame() {
  labels.forEach((label) => {
    label.x = label.startX;
    label.y = label.startY;
    label.isPlaced = false; // Reset placed flag
    label.backgroundColor = "lightblue"; // Reset background color
  });
  drawGame();
}
