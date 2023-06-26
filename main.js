let container;
const width = 300;
const height = 300;
const perspective = 50;

const carSize = 120;
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
        const isCoin = Math.random() < 0.7;
        const x = (Math.random() - 0.5) * roadWidth;
        const y = fromY + Math.random() * 1000;
        const element = document.createElement("div");
        element.style.position = "absolute";
        element.style.width = `${objectSize}px`;
        element.style.height = `${objectSize}px`;
        element.style.fontSize = `${objectSize}px`;
        element.style.overflow = "hidden";
        element.textContent = isCoin ? "💰" : "🧱";
        element.style.backgroundColor = "#880";
        addObjects.push({ x, y, element, isCoin });
    }
    addObjects.sort((a, b) => a.y - b.y);
    addObjects.forEach((object) =>
        container.insertBefore(object.element, road.nextSibling)
    );
    objectList = [...objectList, ...addObjects];
}

let score = 0;
const checkCollision = (from, to) => {
    let collision = false;
    for (const object of objectList) {
        const { x, y, element, isCoin } = object;
        if (from <= y && y <= to) {
            if (Math.abs(x - heroX) < objectSize / 2) {
                if (isCoin) {
                    score += 100;
                    element.remove();
                    object.willRemove = true;
                } else {
                    collision = true;
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
// let count = 3;
// const countDown = () => {
//     console.log(count--);
// }

// 画面の初期設定
let updateDistance = 0;
let dx = 0;
let message;
const init = () => {
    const svg = document.getElementsByTagName("svg")[0];
    svg.style.position = "absolute";
    svg.style.width = `${carSize}px`;
    svg.style.height = `${carSize}px`;
    svg.style.left = `${(width - carSize) / 2}px`;
    svg.style.top = `${((height - carSize) / 4) * 3}px`;

    message = document.createElement("div");
    document.body.append(message);
    message.style.position = "absolute";
    message.style.left = "5px";
    message.style.top = `${height}px`;
    message.textContent = "test";

    container = document.createElement("div");
    document.body.insertBefore(container, svg);
    container.style.position = "absolute";
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.left = 0;
    container.style.top = 0;
    container.style.backgroundColor = "#0ff";
    container.style.overflow = "hidden";
    container.style.perspective = `${perspective}px`;

    ground = document.createElement("div");
    container.append(ground);
    ground.style.position = "absolute";
    ground.style.width = `${groundWidth}px`;
    ground.style.height = `${groundHeight}px`;
    ground.style.backgroundColor = "#080";

    road = document.createElement("div");
    container.append(road);
    road.style.position = "absolute";
    road.style.width = `${roadWidth}px`;
    road.style.height = `${roadHeight}px`;
    road.style.background = "linear-gradient(0, #00f 50%, #f00 50%)";
    road.style.backgroundSize = "100px 100px";

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

    createObject(500);
    updateDistance = 500;

    render();
};

let heroX = 0;
let heroY = 0;
let heroDeg = 0;

window.onload = async () => {
    init();
    let v = 0;

    const endTime = Date.now() + 30000;
    while (true) {
        // if (Date.now() > endTime - 27000) {
        const leftTime = Math.max(0, endTime - Date.now()) / 1000;
        message.textContent = `TIme: ${leftTime.toFixed(3)} / Score: ${score}`;

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

        // 衝突判定
        if (v > 0 && checkCollision(heroY - 30, heroY - 30 + v)) {
            v = -v;
        }
        heroY += v;
        heroX += dx * 3;
        heroX = Math.max(Math.min(heroX, roadWidth / 2), -roadWidth / 2);
        render();
        if (leftTime === 0) {
            return;
        }
        await new Promise(r => setTimeout(r, 16));

        // } else {
        //     const intervalId = setInterval(() => {
        //         countDown();
        //         if (count < 0) {
        //             clearInterval(intervalId);　//intervalIdをclearIntervalで指定している
        //         }
        //     }, 1000);
        // }
    }

};