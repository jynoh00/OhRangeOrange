// 게임 세션 저장용
const sessions = new Map();

class GameState {
    constructor(sessionId) {
        this.sessionId = sessionId;
        this.previousValue = null;
        this.orangeSize = 20;
        this.minValue = 0;
        this.maxValue = 100;
        this.attempts = 0;
        this.isGameOver = false;
        // this.lastUpdateTime = Date.now(); -> 추후 시간 간격 점수 적용 기능 추가 시 사용
    }

    stop(stoppedValue) {
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

        if (this.previousValue === null) {
            this.previousValue = stoppedValue;
            this.attempts++;
            result.success = true;
            result.message = '씨앗에 물을 주세요!';
            result.icon = '🌱';
            result.fillWidth = stoppedValue;
            
            return result;
        }

        if (stoppedValue > this.previousValue) {
            this.previousValue = stoppedValue;
            this.attempts++;
            this.orangeSize += 100;
            result.success = true;
            result.message = '오렌지를 키워주세요!';
            result.icon = '🍊';
            result.orangeSize = this.orangeSize;
            result.fillWidth = stoppedValue;

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
            previousValue: this.previousValue,
            orangeSize: this.orangeSize,
            attempts: this.attempts,
            isGameOver: this.isGameOver,
        };
    }
}

const createSession = sessionId => {
    const game = new GameState(sessionId);
    sessions.set(sessionId, game);

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