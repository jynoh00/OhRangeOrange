# Oh? Range, Orange!🍊
> Range로 Orange🍊를 키우자

오렌지를 키우는 타이밍 게임입니다. 게이지를 잘 멈춰서 오렌지를 최대한 크게 키워보세요!

![Game Image](public/image/index.png)

## 📋 목차

- [주요 기능](#✨-주요-기능)
- [기술 스택](#🛠-기술-스택)
- [시작하기](#🚀-시작하기)
- [프로젝트 구조](#📁-프로젝트-구조)
- [게임 규칙](#🎮-게임-규칙)
- [내부 API](#📡-내부-API)
- [개발 과정](#💡-개발-과정)

## ✨ 주요 기능

- 🎯 **타이밍 게임**: 움직이는 게이지에서 타이밍에 맞게 버튼을 클릭 or 스페이스바를 눌러 이전 값과 비교합니다.
- 🌱 **성장 시스템**: 타이밍에 맞게 눌렀다면 오렌지의 크기가 커지며, 다시 게이지가 움직입니다.
- 📊 **점수 시스템**: 이전 값보다 적은 값의 버튼을 누를 경우 최종적으로 오렌지 크기에 따라 점수가 나타납니다.
- 🔊 **효과음**: 오실레이터 기반 사운드로 버튼 클릭 시 소리가 재생됩니다.
- 🔒 **서버 검증**: 사용자 세션ID에 따른 게임의 상태를 분류하여, 올바른 입력 값을 서버에서 검증합니다.

## 🛠 기술 스택

### Backend
- **Node.js** - JavaScript 런타임
- **Express.js** - 웹 프레임워크
- **Express Session** - 세션 관리
- **EJS** - 템플릿 엔진

### Frontend
- **Vanilla JavaScript** - 프론트엔드 로직
- **CSS3** - 스타일링 및 애니메이션
- **Web Audio API** - 효과음 재생

## 🚀 시작하기

### 필수 요구사항

- Node.js 14.x 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/jynoh00/OhrangeOrange.git
cd OhrangeOrange

# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 브라우저에서 접속
# http://localhost:3000
```

### 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
PORT=3000
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

## 📁 프로젝트 구조

```
orange-growing-game/
├── bin/
│   ├── www                 # Express 서버(http) 시작
├── src/
│   ├── app.js                 # Express 앱 설정
│   ├── config/                # 설정 파일
│   ├── controllers/
│   │   └── gameController.js  # 게임 API 로직
│   ├── models/
│   │   └── gameState.js       # 게임 상태 관리
│   ├── routes/
│   │   ├── index.js           # 메인 라우트
│   │   ├── game.js            # 게임 라우트
│   │   └── error.js           # 에러 라우트
│   └── views/
│       ├── index.ejs          # 메인 페이지
│       ├── game.ejs           # 게임 페이지
│       └── error.ejs          # 에러 페이지
├── public/
│   ├── css/
│   │   └── game.css           # 게임 스타일
│   ├── js/
│   │   └── game.js            # 게임 클라이언트 로직
│   └── music/
│       └── bgm.mp3          # 효과음 파일
├── .env                       # 환경 변수
├── .gitignore
├── package.json
└── README.md
```

## 🎮 게임 규칙

1. **시작**: 게임이 시작되면 게이지가 0~100 사이를 왕복합니다
2. **첫 시도**: 스페이스바 또는 버튼을 눌러 게이지를 멈추면 씨앗(🌱)이 심어집니다
3. **성장**: 이전 시도보다 **높은 값**에 멈춰야 오렌지(🍊)가 자랍니다
4. **실패**: 이전 값보다 낮거나 같은 값에 멈추면 게임이 종료됩니다
5. **목표**: 오렌지를 최대한 크게 키우세요!

### 조작법
- `스페이스바` 또는 `버튼 클릭`: 게이지 정지

## 📡 내부 API

### POST `/game/start`
게임 세션을 시작합니다.

**Response:**
```json
{
  "success": true,
  "sessionId": "session-id",
  "state": {
    "previousValue": null,
    "orangeSize": 20,
    "attempts": 0,
    "isGameOver": false
  }
}
```

### POST `/game/stop`
게이지를 멈추고 결과를 받습니다.

**Request:**
```json
{
  "stoppedValue": 75.5
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "stoppedValue": 75.5,
    "success": true,
    "message": "오렌지를 키워주세요!",
    "icon": "🍊",
    "orangeSize": 120,
    "fillWidth": 75.5
  }
}
```

### POST `/game/restart`
다음 라운드를 시작합니다.
```json
{
  "success": true,
  "state": //game.getState()
}
```

### GET `/game/state`
현재 게임 상태를 조회합니다.

## 💡 개발 과정

### 1. 개발 동기

유저와 직접적으로 맞닿아 있는 프론트엔드와, 라우팅을 관리하고 내부 로직을 수행하는 백엔드 사이의 상호작용을 간단하게 알아보고자 고민하던 중

많은 사람들에게 친숙한 오프라인 게임 문화를 웹으로 구현하면서 이를 적용시켜보고자 오렌지 게임을 구상하며 시작하게 되었습니다.

### 2. 아키텍처 결정

해당 프로젝트에서는 **클라이언트-서버 분리 아키텍처**를 채택했습니다:

- **프론트엔드**: UI 렌더링과 애니메이션만 담당
- **백엔드**: 게임 로직과 검증을 처리하여 보안 강화

추가로 서버에 해당하는 백엔드에서는 컨트롤러와 모델을 분리한, **MVC 패턴**을 기반으로 구현하고자 하였습니다.

- **Model**: gameState 객체, 개별 게임 세션에서 필요한 데이터 처리
- **Controller**: 라우터를 통해 들어온 요청을 GameState 객체를 사용하여 처리
- **View**: EJS 템플릿 엔진 사용, public의 js 및 css와 상호작용

### 3. gameState 모델 설정

개별 게임이 진행됨에 따라 세션으로 분리하여 정보를 다룰 객체를 구현하였습니다.
```js
constructor(sessionId) {
    this.sessionId = sessionId;
    this.previousValue = null;
    this.orangeSize = 20;
    this.minValue = 0;
    this.maxValue = 100;
    this.attempts = 0;
    this.isGameOver = false;
}
```

내부 API 로직을 통해 받아온 데이터에 따라 실시간으로 값을 조절한 후,<br>
결과 값을 다시 프론트로 보내어 유저에게 시각적 결과를 제공합니다.

### 4. 마주한 문제점들

1. **프론트-백엔드 동기화**
   - **문제**: 프론트엔드에서 유저가 설정한 값을 기반으로 로직을 백엔드에서 처리할 때, 실제 프론트에서의 value와 백엔드에서의 value가 일치하지 않아 올바른 결과값 반환되지 않았습니다.

   - **해결**: 내부 API 로직을 사용하여, json 형식의 데이터를 주고 받아 프론트엔드에서의 value를 기반으로 백엔드에서 로직을 처리한 후 다시 json 데이터로 결과값을 반환하게 하여 동기화되도록 하였습니다.

2. **세션 관리**
   - **문제**: 새 페이지가 생성될 때마다 gameState 객체를 생성할 경우, 개별 사용자마다 진행 중인 gameState 정보를 받아올 방법이 필요하였습니다.

   - **해결**: express-session 라이브러리를 활용하여, 사용자가 게임을 시작할 때 sessionId를 생성하여 map 자료구조 방식으로 session에 gameState 객체를 매핑시켜 sesisonId에 따라 검증하고 객체를 가져오는 방식으로 다중 사용자일 경우의 gameState 객체 생성 문제를 해결하였습니다.

## 배경 음악 저작권
<img id="wrtImg" src="https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13048800&amp;filePath=L2Rpc2sxL25ld2RhdGEvMjAxNy85OC9DTFMyL0NOVFJfVFJFQVNVUkVfSFVOVF8yMDE3MDgwOF84MV9NUDM=&amp;thumbAt=Y&amp;thumbSe=b_tbumb&amp;wrtTy=10002">
<p style="font-size: 0.9rem;font-style: italic;">
<span>title : <a href="http://uci.or.kr/G905-13048800"> Tong tong (통통)</a>
authr : <a href="http://uci.or.kr/G905-13048800"> 이혜린</a>by
site : <a href="https://gongu.copyright.or.kr/gongu/main/main.do">공유마당 저작권 위원회</a></span> <br>
is licensed under<!-- CCL(BY) -->
<img src="https://gongu.copyright.or.kr/static/gongu/img/common/img_license21.png" alt="CC BY[저작권정보 표시] " class="img_cc">
<span class="fc_orange">이혜린 </span>의 "Tong tong (통통)" 은 <span class="fc_orange">CC BY</span>  라이선스로 제공됩니다.
</p>

## 👤 개발자

**jynoh00**

- GitHub: [@jynoh00](https://github.com/jynoh00)
- Email: wndus123sh@naver.com
