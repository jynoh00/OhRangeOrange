// 게임 상태
let gameState = {
  isMoving: false,
  currentValue: 0,
  previousValue: null,
  orangeSize: 20, // 시작 크기 (px) - 작게 시작
  minValue: 0,
  maxValue: 100,
  speed: 1,
  direction: 1,
  attempts: 0
};

// DOM
const messageText = document.querySelector('.message');
const orangeIcon = document.querySelector('.orange-icon');
const gaugeLine = document.querySelector('.gauge-line');
const gaugeFill = document.querySelector('.gauge-fill');
const gaugeValue = document.querySelector('.gauge-value');
const controlButton = document.querySelector('.control-button');
const gameOverOverlay = document.querySelector('.game-over-overlay');

// 초기화
function initGame() {
  startGauge();
}

function startGauge() {
  gameState.isMoving = true;
  controlButton.disabled = false;
  gameState.currentValue = 0;
  moveGauge();
}

function moveGauge() {
  if (!gameState.isMoving) return;

  gameState.currentValue += gameState.speed * gameState.direction;

  // 방향 전환
  if (gameState.currentValue >= gameState.maxValue) {
    gameState.currentValue = gameState.maxValue;
    gameState.direction = -1;
  } else if (gameState.currentValue <= gameState.minValue) {
    gameState.currentValue = gameState.minValue;
    gameState.direction = 1;
  }

  updateGaugePosition();
  requestAnimationFrame(moveGauge);
}

// 게이지 위치 업데이트
function updateGaugePosition() {
  const percentage = (gameState.currentValue / gameState.maxValue) * 100;
  gaugeLine.style.left = percentage + '%';
  gaugeValue.textContent = Math.round(gameState.currentValue);
}

// 오렌지 크기 업데이트
function updateOrangeSize() {
  gameState.orangeSize += 100;
  orangeIcon.style.fontSize = gameState.orangeSize + 'px';
}

// 게이지 멈추기
function stopGauge() {
  gameState.isMoving = false;
  gaugeLine.classList.add('stopped');
  controlButton.disabled = true;

  const stoppedValue = gameState.currentValue;
  
  // 첫 시도 (씨앗 심기)
  if (gameState.previousValue === null) {
    gameState.previousValue = stoppedValue;
    gameState.attempts++;
    gaugeFill.style.width = stoppedValue + '%';
    orangeIcon.textContent = '🌱';
    messageText.textContent = '씨앗에 물을 주세요!';


    setTimeout(() => {
      gaugeLine.classList.remove('stopped');
      startGauge();
    }, 800);
    return;
  }

  // 이전 값보다 큰지 확인
  if (stoppedValue > gameState.previousValue) {
    gameState.previousValue = stoppedValue;
    gameState.attempts++;
    orangeIcon.textContent = '🍊';
    messageText.textContent = '오렌지를 키워주세요!';
    gaugeFill.style.width = stoppedValue + '%';

    orangeIcon.classList.add('grow');
    setTimeout(() => orangeIcon.classList.remove('grow'), 500);
    
    updateOrangeSize();
    
    setTimeout(() => {
      gaugeLine.classList.remove('stopped');
      startGauge();
    }, 800);
  } else {
    gaugeFill.style.background = 'linear-gradient(90deg, #f44336, #ef5350)';

    setTimeout(() => gameOver(), 500);
  }
}

function gameOver() {
  const finalSize = Math.round(gameState.orangeSize * 10) / 10;
  
  document.querySelector('.game-over h2').textContent = '게임 종료!';
  document.querySelector('.final-size').textContent = `최종 오렌지 크기: ${finalSize}rem`;
  document.querySelector('.attempts').textContent = `시도 횟수: ${gameState.attempts}`;
  
  gameOverOverlay.classList.add('show');
}

controlButton.addEventListener('click', stopGauge);
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !controlButton.disabled) {
    e.preventDefault();
    stopGauge();
  }
});

initGame();