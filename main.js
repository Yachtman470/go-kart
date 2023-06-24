let container;
const width = 300;
const height = 300;
const perspective = 50;

let ground;
const groundWidth = 50000;
const groundHeight = 50000;
const eyeToGround = 30;

const render = () => {
    ground.style.transform = `
    translate3d(${(width - groundWidth) / 2}px, ${(height - groundHeight) / 2}px, 0)
    translate3d(0, ${eyeToGround}px, 0)S
    rotate3d(1, 0, 0, 90deg)
    `;
};

const init = () => {
    container = document.createElement("div");
    document.body.append(container);
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

    render();
};

window.onload = () => {
    init();
};