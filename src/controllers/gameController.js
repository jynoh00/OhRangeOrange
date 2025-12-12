const { createSession, getSession, deleteSession } = require('../models/gameState');

exports.startGame = (req, res) => {
    try {
        const sessionId = req.sessionID || req.session.id;

        deleteSession(sessionId); // 기존 세션 삭제

        const game = createSession(sessionId);

        res.json({
            success: true,
            sessionId: sessionId,
            state: game.getState(),
        });
    } catch (error) {
        console.error('Game start Error: ', error);
        res.status(500).json({
            success: false,
            message: '게임 시작 중 오류가 발생하였습니다',
        });
    }
};

exports.getGameState = (req, res) => {
    try {
        const sessionId = req.sessionID || req.session.id;
        const game = getSession(sessionId);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: '게임 세션을 찾을 수 없습니다',
            });
        }

        res.json({
            success: true,
            state: game.getState()
        });

    } catch (error) {
        console.error('Game state find Error: ', error);
        res.status(500).json({
            success: false,
            message: '게임 상태 조회 중 오류가 발생하였습니다',
        });
    }
};

exports.stopGauge = (req, res) => {
    try {
        const sessionId = req.sessionID || req.session.id;
        const game = getSession(sessionId);
        const { stoppedValue } = req.body;

        if (!game) {
            return res.status(404).json({
                success: false,
                message: '게임 세션을 찾을 수 없습니다',
            });
        }

        if (game.isGameOver) {
            return res.status(400).json({
                success: false,
                message: '게임이 이미 종료되었습니다'
            });
        }

        // validate stoppedValue
        if (typeof stoppedValue !== 'number' || stoppedValue < 0 || stoppedValue > 100) {
            return res.status.json({
                success: false,
                message: '잘못된 값입니다',
            });
        }

        const result = game.stop(stoppedValue);

        res.json({
            success: true,
            result: result,
            state: game.getState()
        });
    } catch (error) {
        console.error('Gauge stop Error: ', error);
        res.status(500).json({
            success: false,
            message: '게이지 정지 중 오류가 발생하였습니다',
        });
    }
};

exports.restartGauge = (req, res) => {
    try {
        const sessionId = req.sessionID || req.session.id;
        const game = getSession(sessionId);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: '게임 세션을 찾을 수 없습니다',
            });
        }

        if (game.isGameOver) {
            return res.status(400).json({
                success: false,
                message: '게임이 종료되었습니다. 새 게임을 시작해주세요',
            });
        }

        res.json({
            success: true,
            state: game.getState()
        });
    } catch (error) {
        console.error('Game restart Error: ', error);
        res.status(500).json({
            success: false,
            message: '게임 재시작 중 오류가 발생하였습니다',
        });
    }
};