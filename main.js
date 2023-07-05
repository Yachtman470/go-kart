let container;
const width = 1000;
const height = 600;
const adjustWidth = 30;
const perspective = 50;
const screen_left = 300;
const screen_top = 200;
const carSize = 200;
const carShow = 400;
const objectSize = 50;

let ground;
const groundWidth = 50000;
const groundHeight = 50000;
const eyeToGround = 30;

let road;
const roadWidth = 300;
const roadHeight = 50000;
const eyeToRoad = eyeToGround - 1;

const render = () => {
    ground.style.transform = `
    translate3d(${(width - groundWidth) / 2}px, ${(height - groundHeight) / 2}px, 0)
    rotate3d(0, 0, 1, ${-heroDeg}deg)
    translate3d(${-heroX}px, ${eyeToGround}px, 0)
    rotate3d(1, 0, 0, 90deg)
    `;

    road.style.transform = `
    translate3d(${(width - roadWidth) / 2}px, ${(height - roadHeight) / 2}px, 0)
    rotate3d(0, 0, 1, ${-heroDeg}deg)
    translate3d(${-heroX}px, ${eyeToRoad}px, 0)
    rotate3d(1, 0, 0, 90deg)  
    translate3d(0, ${heroY % 100}px, 0)
    `;

    for (const object of objectList) {
        const { x, y, element } = object;
        element.style.transform = `
        translate3d(${width / 2 - objectSize / 2}px, ${height / 2 - objectSize / 2}px, 0)
        rotate3d(0, 0, 1, ${-heroDeg}deg)
        translate3d(${-heroX}px, ${eyeToRoad}px, 0)
        rotate3d(1, 0, 0, 90deg)
        translate3d(0, ${heroY}px, 0)
        translate3d(${x}px, ${-y}px, ${objectSize / 2}px)
        rotate3d(1, 0, 0, -90deg)    
        `;
    }
};

let objectList = [];
const createObject = (fromY) => {
    const addObjects = [];
    for (let i = 0; i < 10; i++) {
        const x = (Math.random() - 0.5) * roadWidth;
        const y = fromY + Math.random() * 1000;
        const element = document.createElement("img");
        // const element = document.createElement("div");
        element.style.position = "absolute";
        element.style.width = `${objectSize}px`;
        element.style.height = `${objectSize}px`;
        element.style.fontSize = `${objectSize}px`;
        element.style.overflow = "hidden";
        // let isCoin;
        const whatObject = Math.random();
        if (whatObject < 0.7) {
            element.src = "img/coin.png";
            element.style.borderRadius = "100%";
            // isCoin = true;
        } else if (whatObject < 0.85) {
            element.src = "img/wall.png";
        } else {
            element.src = "img/kame.png";
            element.style.borderRadius = "100%";
            // isCoin = false;
        }
        // element.src = isCoin ? "img/coin.png" : "img/wall.png";
        // element.style.borderRadius = isCoin ? "100%" : "0%";
        // element.textContent = isCoin ? "💰" : "🧱";
        element.style.backgroundColor = "#880";
        addObjects.push({ x, y, element, whatObject });
    }
    addObjects.sort((a, b) => a.y - b.y);
    addObjects.forEach((object) =>
        container.insertBefore(object.element, road.nextSibling)
    );
    objectList = [...objectList, ...addObjects];
}

let score = 0;
const checkCollision = (from, to) => {
    let collision = 0;
    for (const object of objectList) {
        const { x, y, element, whatObject } = object;
        if (from <= y && y <= to) {
            if (Math.abs(x - heroX) < objectSize / 2) {
                if (whatObject < 0.7) {
                    score += 100;
                    element.remove();
                    object.willRemove = true;
                } else if (whatObject < 0.85) {
                    collision = 1;
                } else {
                    collision = 2;
                }
            } else {
                element.remove();
                object.willRemove = true;
            }
        }
    }
    objectList = objectList.filter((object) => !object.willRemove);
    return collision;
}

// レース開始前にカウントダウンする
let count = 5;
const countDown = () => {
    count--;
    switch (count) {
        case 3:
            countNum.textContent = "3";
            audio_start.play();
            break;
        case 2:
            countNum.textContent = "2";
            break;
        case 1:
            countNum.textContent = "1";
            break;
        case 0:
            countNum.textContent = "GO!!";
            break;
        case -2:
            countNum.textContent = "";
            console.log("here");
            break;
    }
}

// 車の選択を0/1で保持
let car_select;
// ゲームのスタート画面
const init_game = () => {
    // 初期設定としてsvgを非表示
    document.getElementById("car_white").style.display = "none";
    document.getElementById("car_blue").style.display = "none";

    const car0 = document.createElement("img");
    car0.id = "test"
    car0.src = "img/car_white.png";
    car0.style.position = "absolute";
    car0.style.width = `${carShow}px`;
    car0.style.height = `${carShow}px`;
    car0.style.left = `${(width - carShow) / 2}px`;
    car0.style.top = `${((height - carShow) / 4) * 3 + screen_top}px`;

    const car1 = document.createElement("img");
    car1.id = "test"
    car1.src = "img/car_blue.png";
    car1.style.position = "absolute";
    car1.style.width = `${carShow}px`;
    car1.style.height = `${carShow}px`;
    car1.style.left = `${(width - carShow) / 2 + 2 * screen_left}px`;
    car1.style.top = `${((height - carShow) / 4) * 3 + screen_top}px`;

    choose_p = document.createElement("p");
    choose_p.style.fontSize = "30px";
    choose_p.style.color = "#000";
    choose_p.style.position = "absolute";
    choose_p.style.textAlign = "center";
    choose_p.innerText = "NO POLICE AND\nNO SPEED LIMITS...\n\nCHOOSE YOUR CAR";
    choose_p.style.width = `${1000}px`;
    choose_p.style.left = `${screen_left}px`;
    choose_p.style.top = `${screen_top / 3}px`;

    document.body.append(car0);
    document.body.append(car1);
    document.body.append(choose_p);

    // 何らかのキーボード入力時、車選択時のBGMを流す
    window.addEventListener('click', e => {
        audio_select.play();
    }, { once: true });

    // 矢印キー操作による左右移動
    let keydown = '';
    document.body.addEventListener('keydown', e => {
        keydown = e.key;
        switch (keydown) {
            case 'ArrowLeft':
                car_select = 0;
                car0.remove();
                car1.remove();
                // choose_p.remove();
                choose_p.innerText = "Pick Up Coins!";
                choose_p.style.fontSize = "40px";
                audio_select.pause();
                before_race();
                break;
            case 'ArrowRight':
                car_select = 1;
                car0.remove();
                car1.remove();
                // choose_p.remove();
                choose_p.innerText = "Pick Up Coins!";
                choose_p.style.fontSize = "40px";
                audio_select.pause();
                before_race();
                break;
        }
    }, { once: true });
}

const before_race = () => {
    init_race();
    // スタート前からレースBGMを流す
    audio_race.play();

    const intervalId = setInterval(() => {
        countDown();
        if (count == 0) {
            startGame();
        } else if (count == -2) {
            //intervalIdをclearIntervalで指定
            clearInterval(intervalId);
        }
    }, 1000);
}

// 画面の初期設定
let updateDistance = 0;
let dx = 0;
let message;
const init_race = () => {
    const car = document.getElementsByTagName("svg")[car_select];
    car.style.display = "block";
    car.style.position = "absolute";
    car.style.width = `${carSize}px`;
    car.style.height = `${carSize}px`;
    car.style.left = `${(width - carSize) / 2 + screen_left}px`;
    car.style.top = `${((height - carSize) / 4) * 3 + screen_top}px`;

    message = document.createElement("div");
    document.body.append(message);
    message.style.position = "absolute";
    message.style.left = `${width}px`;
    message.style.top = `${height * 1.4}px`;
    message.style.fontSize = "30px";
    message.textContent = "Time: --- / Score: ---";

    container = document.createElement("div");
    document.body.insertBefore(container, car);
    container.style.position = "absolute";
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.left = `${screen_left}px`;
    container.style.top = `${screen_top}px`;
    container.style.backgroundColor = "#223A70";
    container.style.overflow = "hidden";
    container.style.perspective = `${perspective}px`;

    ground = document.createElement("div");
    container.append(ground);
    ground.style.position = "absolute";
    ground.style.width = `${groundWidth}px`;
    ground.style.height = `${groundHeight}px`;
    ground.style.backgroundColor = "#000";

    road = document.createElement("div");
    container.append(road);
    road.style.position = "absolute";
    road.style.width = `${roadWidth}px`;
    road.style.height = `${roadHeight}px`;
    road.style.background = "linear-gradient(to bottom, #F00, #FFA500 15%, #FF0 30%, #008000 44%, #0FF 58%, #00F 72%, #800080)";
    road.style.backgroundSize = "100px 100px";

    countNum = document.createElement("p");
    container.append(countNum);
    countNum.style.fontSize = "50px";
    countNum.style.color = "#FFF";
    countNum.style.textAlign = "center";
    countNum.textContent = "Are You Ready?";

    // title = document.createElement("p");
    // .append(title);
    // title.style.position = "absolute";
    // title.style.left = `${screen_left}px`;
    // title.style.top = `${-100}px`;
    // title.style.fontSize = "50px";
    // title.style.color = "#000";
    // title.style.textAlign = "center";
    // title.textContent = "aaaaa";

    // マウス操作による左右移動
    let originalX = -1;
    document.onmousedown = document.ontouchstart = (e) => {
        e.preventDefault();
        if (e.touches && e.touches[0]) {
            e = e.touches[0];
        }
        originalX = e.pageX;
        dx = 0;
    };
    document.onmousemove = document.ontouchmove = (e) => {
        e.preventDefault();
        if (e.touches && e.touches[0]) {
            e = e.touches[0];
        }
        if (originalX !== -1) {
            if (e.pageX - originalX > 0) {
                dx = 1;
            } else if (e.pageX - originalX < 0) {
                dx = -1;
            }
        }
    };
    document.onmouseup = document.ontouchend = (e) => {
        e.preventDefault();
        originalX = -1;
        dx = 0;
    };

    // 矢印キー操作による左右移動
    let keydown = '';
    document.body.addEventListener('keydown', e => {
        keydown = e.key;
        switch (keydown) {
            case 'ArrowLeft':
                dx = -1;
                break;
            case 'ArrowRight':
                dx = 1;
                break;
        }
    });
    document.body.addEventListener('keyup', e => {
        dx = 0;
    });

    // 初期的にオブジェクトを500px分生成
    createObject(500);
    updateDistance = 500;
    render();
};

let heroX = 0;
let heroY = 0;
let heroDeg = 0;
const audio_select = new Audio("sound/car_select.mp3");
const audio_start = new Audio("sound/start.mp3");
const audio_race = new Audio("sound/race.mp3");
const audio_clear = new Audio("sound/clear.mp3");
const audio_gameOver = new Audio("sound/gameOver.mp3");

// window.onload = async () => {
window.onload = () => {
    init_game();
}

// 一定時間処理を遅らせる関数
const sleep = waitTime => new Promise(resolve => setTimeout(resolve, waitTime));

const startGame = async () => {
    let v = 0;
    let finish = true;
    const endTime = Date.now() + 30000;

    while (true) {
        const leftTime = Math.max(0, endTime - Date.now()) / 1000;
        message.textContent = `Time: ${leftTime.toFixed(3)} / Score: ${score}`;

        // 一定の走行距離を超える度に1000px分オブジェクトを追加生成
        if (heroY > updateDistance) {
            updateDistance += 1000;
            createObject(updateDistance);
        }

        if (dx > 0) {
            if (heroDeg < 0) {
                heroDeg += 2;
            } else {
                heroDeg++;
            }
        } else if (dx < 0) {
            if (heroDeg > 0) {
                heroDeg -= 2;
            } else {
                heroDeg--;
            }
        } else {
            if (heroDeg > 0) {
                heroDeg--;
            } else if (heroDeg < 0) {
                heroDeg++;
            }
        }
        heroDeg = Math.max(Math.min(30, heroDeg), -30);

        // 加速度と風の抵抗
        v += 0.1;
        v -= v ** 3 * 0.0003;

        // 衝突/スリップ判定
        if (v > 0) {
            if (checkCollision(heroY - 30, heroY - 30 + v) == 1) {
                v = -v;
            } else if (checkCollision(heroY - 30, heroY - 30 + v) == 2) {
                v = 3;
                if (Math.random() < 0.5) {
                    dx = 3;
                } else {
                    dx = -3;
                }
            }
        }

        heroY += v;
        heroX += dx * 3;
        if (heroX < -roadWidth / 2 - adjustWidth || roadWidth / 2 + adjustWidth < heroX) {
            finish = false;
            break;
        }
        // heroX = Math.max(Math.min(heroX, roadWidth / 2), -roadWidth / 2);
        render();
        if (leftTime === 0) {
            break;
        }

        // async内でのみ機能する動作
        await new Promise(r => setTimeout(r, 16));
    }

    if (finish) {
        // レース終了
        audio_race.pause();
        countNum.textContent = "Finish!";
        await sleep(2000);
        audio_clear.play();
    } else {
        audio_race.pause();
        countNum.textContent = "Game Over...";
        await sleep(2000);
        audio_gameOver.play();
    }
};