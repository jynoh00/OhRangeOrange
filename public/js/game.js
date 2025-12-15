// DOM
const messageText = document.querySelector('.message');
const orangeIcon = document.querySelector('.orange-icon');
const gaugeLine = document.querySelector('.gauge-line');
const gaugeFill = document.querySelector('.gauge-fill');
const gaugeValue = document.querySelector('.gauge-value');
const controlButton = document.querySelector('.control-button');
const gameOverOverlay = document.querySelector('.game-over-overlay');

const frame = document.getElementById("bgm-frame");

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const playClickSound = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // Hz
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
};

const localState = {
    isMoving: false,
    currentValue: 0,
    animationFrame: null
};

const initGame = async () => {
    try {
        const response = await fetch('/game/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (data.success) {
            localState.isMoving = true;
            controlButton.disabled = false;
            startGaugeAnimation();
        }

    } catch (error) {
        console.error('Game init Error: ', error);
        messageText.textContent = '게임 초기화 중 오류가 발생하였습니다';
    }
};

const startGaugeAnimation = () => {
    let direction = 1, value = 0;
    const speed = 1;

    const animate = () => {
        if (!localState.isMoving) return;

        value += speed * direction;

        // 이 부분 좀 짜침 (1. 하드 코딩 느낌, 2. 매직 넘버 사용)
        if (value >= 100) {
            value = 100;
            direction = -1;
        }

        if (value <= 0) {
            value = 0;
            direction = 1;
        }

        localState.currentValue = value;
        updateGaugePosition(value);

        localState.animationFrame = requestAnimationFrame(animate);
    };

    animate();
};

const updateGaugePosition = value => {
    gaugeLine.style.left = `${value}%`;
    gaugeValue.textContent = Math.round(value);
};

const updateOrangeSize = size => orangeIcon.style.fontSize = size + 'px';

const stopGauge = async () => {
    if (!localState.isMoving) return;

    playClickSound();

    const stoppedValue = localState.currentValue;

    localState.isMoving = false;
    cancelAnimationFrame(localState.animationFrame);
    gaugeLine.classList.add('stopped');
    controlButton.disabled = true;

    try {
        const response = await fetch('/game/stop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                stoppedValue: stoppedValue,
            }),
        });

        const data = await response.json();

        if (data.success) {
            handleStopResult(data.result);
            return;
        }

        /* 이 부분 삭제 해도 될 것 같은데*/
        // messageText.textContent = data.message || '오류가 발생하였습니다';
        // controlButton.disabled = false;
        // localState.isMoving = true;
        // gaugeLine.classList.remove('stopped');
        // startGaugeAnimation();

    } catch (error) {
        console.error('Gauge stop Error: ', error);
        messageText.textContent = '서버 통신 중 오류가 발생하였습니다';
        
        /* 이 부분도 이상 */
        // controlButton.disabled = false;
        // localState.isMoving = true;
        // gaugeLine.classList.remove('stopped');
        // startGaugeAnimation();
    }
};

const handleStopResult = result => {
    // check! stoppedValue 미사용
    const { stoppedValue, success, gameOver, message, icon, orangeSize, fillWidth } = result;

    // 추후 delete
    console.log(`stoppedValue by Server: ${stoppedValue}`);

    gaugeFill.style.width = fillWidth + '%';

    if (gameOver) {
        gaugeFill.style.background = 'linear-gradient(90deg, #f44336, #ef5350)';
        setTimeout(() => showGameOver(result), 500);

        return;
    }

    if (success) {
        messageText.textContent = message;
        orangeIcon.textContent = icon;

        if (icon === '🍊') {
            updateOrangeSize(orangeSize);
            orangeIcon.classList.add('grow');
            setTimeout(() => orangeIcon.classList.remove('grow'), 500);
        }

        setTimeout(() => {
            restartGauge();
            gaugeLine.classList.remove('stopped');
        }, 800);
    }
};

const showGameOver = result => {
    document.querySelector('.game-over h2').textContent = result.message;
    document.querySelector('.final-size').textContent = `최종 오렌지 크기: ${result.finalSize}`;
    document.querySelector('.attempts').textContent = `시도 횟수: ${result.attempts}`;
    gameOverOverlay.classList.add('show');
};

const restartGauge = async () => {
    try {
        const response = await fetch('/game/restart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (data.success) {
            gaugeLine.classList.remove('stoppped');
            localState.isMoving = true;
            controlButton.disabled = false;
            
            startGaugeAnimation();
        }

    } catch (error) {
        console.error('Game restart Error: ', error);
        messageText.textContent = '게임 재시작 중 오류가 발생하였습니다';
    }
};

// Event Listener
controlButton.addEventListener('click', stopGauge);
document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !controlButton.disabled) {
        frame.contentWindow.postMessage("PLAY_BGM", "*");
        e.preventDefault();
        stopGauge();
    }
});

initGame();