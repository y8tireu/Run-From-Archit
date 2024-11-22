const player = document.getElementById("player");
const archit = document.getElementById("archit");
const spike = document.getElementById("spike");
const coin = document.getElementById("coin");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const gameOverElement = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let isGameOver = false;
let playerY = 0;
let gravity = 2;
let jumpStrength = 30;
let isJumping = false;

// Update high score display
highScoreElement.textContent = highScore;

// Reset obstacles
function resetSpikeAndCoin() {
  spike.style.left = window.innerWidth + "px";
  coin.style.left = window.innerWidth + Math.random() * 200 + 100 + "px";

  // Ensure coin doesn't overlap with the spike
  while (Math.abs(parseInt(spike.style.left) - parseInt(coin.style.left)) < 50) {
    coin.style.left = window.innerWidth + Math.random() * 200 + 100 + "px";
  }

  coin.style.bottom = Math.random() * (window.innerHeight - 150) + "px";
}

// Move obstacles
function moveObstacles() {
  if (isGameOver) return;

  let spikeX = parseInt(getComputedStyle(spike).left);
  let coinX = parseInt(getComputedStyle(coin).left);

  spike.style.left = (spikeX - 5) + "px";
  coin.style.left = (coinX - 5) + "px";

  if (spikeX < -30) resetSpikeAndCoin();
  if (coinX < -30) resetSpikeAndCoin();

  checkCollision();
  requestAnimationFrame(moveObstacles);
}

// Refined Collision Detection
function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const spikeRect = spike.getBoundingClientRect();
  const coinRect = coin.getBoundingClientRect();

  // Adjusted hitboxes for better gameplay experience
  const playerHitbox = {
    left: playerRect.left + 5,  // Shrink hitbox slightly
    right: playerRect.right - 5,
    top: playerRect.top + 5,
    bottom: playerRect.bottom - 5
  };

  const spikeHitbox = {
    left: spikeRect.left + 2,
    right: spikeRect.right - 2,
    top: spikeRect.top + 2,
    bottom: spikeRect.bottom - 2
  };

  const coinHitbox = {
    left: coinRect.left + 5,
    right: coinRect.right - 5,
    top: coinRect.top + 5,
    bottom: coinRect.bottom - 5
  };

  // Collision with spike
  if (
    playerHitbox.left < spikeHitbox.right &&
    playerHitbox.right > spikeHitbox.left &&
    playerHitbox.top < spikeHitbox.bottom &&
    playerHitbox.bottom > spikeHitbox.top
  ) {
    endGame();
  }

  // Collision with coin
  if (
    playerHitbox.left < coinHitbox.right &&
    playerHitbox.right > coinHitbox.left &&
    playerHitbox.top < coinHitbox.bottom &&
    playerHitbox.bottom > coinHitbox.top
  ) {
    score += 10;
    scoreElement.textContent = score;
    resetSpikeAndCoin();
  }
}

// End game
function endGame() {
  isGameOver = true;
  gameOverElement.style.display = "block";

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreElement.textContent = highScore;
  }
}

// Jump functionality
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isJumping) {
    isJumping = true;
    playerY = jumpStrength;
  }
});

// Apply gravity
function applyGravity() {
  if (isGameOver) return;

  playerY -= gravity;
  const playerBottom = parseInt(getComputedStyle(player).bottom);
  player.style.bottom = Math.max(playerBottom + playerY, 20) + "px";

  if (parseInt(player.style.bottom) <= 20) {
    isJumping = false;
    playerY = 0;
  }

  requestAnimationFrame(applyGravity);
}

// Restart game
restartBtn.addEventListener("click", () => {
  score = 0;
  scoreElement.textContent = score;
  gameOverElement.style.display = "none";
  isGameOver = false;
  resetSpikeAndCoin();
  moveObstacles();
  applyGravity();
});

// Initialize game
resetSpikeAndCoin();
moveObstacles();
applyGravity();

