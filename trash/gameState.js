// 게임 세션 저장용
const sessions = new Map();

class GameState {
    constructor(sessionId) {
        this.sessionId = sessionId;
        this.isMoving = false;
        this.currentValue = 0;
        this.previousValue = null;
        this.orangeSize = 20;
        this.minValue = 0;
        this.maxValue = 100;
        this.speed = 1; // front에도 존재
        this.direction = 1; // front에도 존재
        this.attempts = 0;
        this.isGameOver = false;
        // this.lastUpdateTime = Date.now(); -> 추후 시간 간격 점수 적용 기능 추가 시 사용
    }

    calculateCurrentValue() {
        if (!this.isMoving) return this.currentValue;

        // 여기가 문제
        this.currentValue += this.speed * this.direction;

        if (this.currentValue >= this.maxValue) {
            this.currentValue = this.maxValue;
            this.direction = -1;
        }

        if (this.currentValue <= this.minValue) {
            this.currentValue = this.minValue;
            this.direction = 1;
        }

        return this.currentValue;
    }

    start() {
        this.isMoving = true;
        this.currentValue = 0;
    }

    stop() {
        this.isMoving = false;
        this.calculateCurrentValue();

        const result = {
            stoppedValue: this.currentValue,
            isFirstAttempt: this.previousValue === null,
            success: false,
            gameOver: false,
            message: '',
            icon: '',
            orangeSize: this.orangeSize,
            attempts: this.attempts,
            fillWidth: 0,
        };

        if (this.previousValue == null) {
            this.previousValue = this.currentValue;
            this.attempts++;
            result.success = true;
            result.message = '씨앗에 물을 주세요!';
            result.icon = '🌱';
            result.fillWidth = this.currentValue;
            
            return result;
        }

        if (this.currentValue > this.previousValue) {
            this.previousValue = this.currentValue;
            this.attempts++;
            this.orangeSize += 100;
            result.success = true;
            result.message = '오렌지를 키워주세요!';
            result.icon = '🍊';
            result.orangeSize = this.orangeSize;
            result.fillWidth = this.currentValue;

            return result;
        }

        this.isGameOver = true;
        result.gameOver = true;
        result.message = '게임 종료!';
        result.finalSize = Math.round(this.orangeSize * 10) / 10;
        result.attempts = this.attempts;

        return result;
    }

    getState() {
        return {
            isMoving: this.isMoving,
            currentValue: this.calculateCurrentValue(),
            previousValue: this.previousValue,
            orangeSize: this.orangeSize,
            attempts: this.attempts,
            isGameOver: this.isGameOver,
            direction: this.direction,
        };
    }
}

const createSession = sessionId => {
    const game = new GameState(sessionId);
    sessions.set(sessionId, game);

    game.start();
    return game;
};

const getSession = sessionId => sessions.get(sessionId);
const deleteSession = sessionId => sessions.delete(sessionId);

module.exports = {
    GameState,
    createSession,
    getSession,
    deleteSession,
};