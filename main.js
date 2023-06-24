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
    translate3d(${-heroX}px, ${eyeToGround}px, 0)
    rotate3d(1, 0, 0, 90deg)
    `;

    road.style.transform = `
    translate3d(${(width - roadWidth) / 2}px, ${(height - roadHeight) / 2}px, 0)
    translate3d(${-heroX}px, ${eyeToRoad}px, 0)
    rotate3d(1, 0, 0, 90deg)
    translate3d(0, ${heroY % 100}px, 0)
    `;

    for (const object of objectList) {
        const { x, y, element } = object;
        element.style.transform = `
        translate3d(${width / 2 - objectSize / 2}px, ${height / 2 - objectSize / 2}px, 0)
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
    for (let i = 0; i < 10; i++) {
        const x = (Math.random() - 0.5) * roadWidth;
        const y = fromY + Math.random() * 1000;
        const element = document.createElement("div");
        element.style.position = "absolute";
        element.style.width = `${objectSize}px`;
        element.style.height = `${objectSize}px`;
        element.style.backgroundColor = "#880";
        objectList.push({ x, y, element });
        container.append(element);
    }
}

const checkCollision = (from, to) => {
    let collision = false;
    for (const object of objectList) {
        const { x, y, element } = object;
        if (from <= y && y <= to) {
            if (Math.abs(x - heroX) < objectSize / 2) {
                collision = true;
            } else {
                element.remove();
                object.willRemove = true;
            }
        }
    }
    objectList = objectList.filter((object) => !object.willRemove);
    return collision;
}

let updateDistance = 0;
const init = () => {
    const svg = document.getElementsByTagName("svg")[0];
    svg.style.position = "absolute";
    svg.style.width = `${carSize}px`;
    svg.style.height = `${carSize}px`;
    svg.style.left = `${(width - carSize) / 2}px`;
    svg.style.top = `${((height - carSize) / 4) * 3}px`;

    container = document.createElement("div");
    document.body.insertBefore(container, svg);
    // document.body.append(container);
    // document.body.insertBefore(container, svg);
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

    createObject(500);
    updateDistance = 500;

    render();
};

let heroX = 0;
let heroY = 0;

window.onload = async () => {
    init();
    let dummy = 0;
    let v = 0;
    while (true) {
        dummy++;

        if (heroY > updateDistance) {
            updateDistance += 1000;
            createObject(updateDistance);
        }

        // 加速度と風の抵抗
        v += 0.1;
        v -= v ** 3 * 0.0003;

        // 衝突判定
        if (v > 0 && checkCollision(heroY - 30, heroY - 30 + v)) {
            v = -v;
        }
        heroY += v;
        heroX = (Math.sin(dummy * 0.05) * roadWidth / 2);
        render();
        await new Promise(r => setTimeout(r, 16));

    }

};