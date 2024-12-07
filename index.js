const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const text = canvas.getContext("2d");
let dragOffsetX = 0;
let dragOffsetY = 0;

function showPopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("hidden");
}

function restartGame() {
  const popup = document.getElementById("popup");
  popup.classList.add("hidden");
  resetGame();
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
    } else {
      draggingLabel.x = startX;
      draggingLabel.y = startY;
      draggingLabel.isPlaced = false;
    }

    draggingLabel = null;
    drawGame();
  }
}

function speakLabel(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  // const femaleVoice = voices.find((voice) =>
  //   voice.name.toLowerCase().includes("female")
  // );

  // if (femaleVoice) {
  //   utterance.voice = femaleVoice;
  // }

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
