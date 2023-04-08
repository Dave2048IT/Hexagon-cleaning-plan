console.log("Start ms", start = window.performance.now());

const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    fromDate = document.getElementById('fromDate'),
    toDate = document.getElementById('toDate'),
    myRadius = document.getElementById('myRadius'),
    myNameOffset = document.getElementById('myNameOffset'),
    myCountNames = document.getElementById('myCountNames'),
    myNames = document.getElementById('myNames'),
    myServices = document.getElementById('myServices');

const refDate = new Date("12/02/2022"),
    services = ["🛁🔷-Bad:", "🛋 Wohnen:", "🚮♻️ Müll:", "🛁🔶-Bad:", "🏠 Flur:", "🍛 Küche:"],
    names = ["Der Anführer", "2. Bewohner", "3. Bewohner",  "4. Bewohner", "5. Bewohner", "6. Bewohner"];

let r, xoff, yoff = 50, weeks;

ctx.lineWidth = 2;
ctx.fillStyle = ctx.strokeStyle = "white";

function hide_or_show() {
    myInputs.style.display =
    (myInputs.style.display !== "none" ? "none" : "block");
}

function init() {
    // calculate time difference
    const newDate = new Date();
    const time_difference = newDate.getTime() - refDate.getTime();

    // calculate weeks difference by dividing total milliseconds in a week
    const WEEK_MS = 604800000;
    weeks = Math.floor(time_difference / WEEK_MS) + parseInt(myNameOffset.value);

    newDate.setDate(newDate.getDate() + 1 - (newDate.getDay()) % 7);
    const fromDateString = getMyDate(newDate);
    fromDate.textContent = fromDateString;

    newDate.setDate(newDate.getDate() + 6);
    const toDateString = getMyDate(newDate);
    toDate.textContent = toDateString;

    myServices.value = services;
    myNames.value = names;
    // alert("Ich nehme, ihr seid zu 5?\nWenn ihr aber wieder zu 6 seid, müsst ihr den Offset wieder von 2 auf 0 stellen. ;-)")

    redraw();
}
init();

function redraw() {
    const start = window.performance.now(),
        min_outer = window.outerHeight < window.outerWidth ? window.outerHeight : window.outerWidth;

    let isBig = false;
    r = myRadius.value > 0 ? myRadius.value | 0 : min_outer / 2;
    if (r >= 333) {
        r = 333;
        isBig = true;
    }
    myRadius.value = r;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = r/4 +"px Arial";
    const setCount = myCountNames.value | 0,
        namesList = myNames.value.split(","),
        servicesList = myServices.value.split(",");

    xoff = (window.outerWidth / 2) + 5/4*r; // 2*r;
    const rsina = r * Math.sin(2 * Math.PI / 6);
    if (isBig)
        xoff = r*2;

    drawFootballShape(xoff, yoff, r);
    fillNames(setCount, namesList, servicesList);
    
    // End of redraw
    const finishTime = window.performance.now();
    console.log("Finish µs", 1000 * (finishTime - start) | 0);
}

function drawHexagon(x, y) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + r * Math.cos(2 * Math.PI / 6 * i), y + r * Math.sin(2 * Math.PI / 6 * i));
    }
    ctx.closePath();
    ctx.stroke();
}

function drawFootballShape(xoff, yoff, r) {
    const [a, b] = [r * Math.cos(2 * Math.PI / 6), r * Math.sin(2 * Math.PI / 6)];
    const positions = [
        {x: xoff + r, y: yoff + b},
        {x: xoff + r, y: yoff + 5 * b},
        {x: xoff - a, y: yoff + 4 * b},
        {x: xoff - a, y: yoff + 2 * b},
        {x: xoff + 5 * a, y: yoff + 2 * b},
        {x: xoff + 5 * a, y: yoff + 4 * b},
    ];
    for (const {x, y} of positions) {
        drawHexagon(x, y);
    }
}


function fillNames(n, namesList, servicesList) {
    function modulo(val, m) {
        return ((val % m) + m) % m | 0;
    }
    
    let idx = -weeks % n +1;
    const r2 = 2 * r;
    const sin60 = Math.sin(Math.PI / 3);
    const cos60 = Math.cos(Math.PI / 3);

    for (let i = 0; i < 6; i++) {
        idx = modulo(idx - 1, n);
        const isClone = n === 5 && i === 2;
        if (isClone) {
            idx = (idx + 3) % 5;
        }
        
        ctx.fillStyle = ctx.strokeStyle = "white";
        const angle = -2 * Math.PI / 6 * i;
        const x = xoff + r*3/8 + r2 * Math.sin(angle) * sin60 - 30;
        const y = yoff + r*3/4 + r2 * (-Math.cos(angle)+1) * sin60;

        ctx.fillText(servicesList[i ? 6-i : 0], x, y);

        ctx.fillStyle = "hsl("+60*idx+", 100%, 60%)";
        ctx.fillText(namesList[idx], x, y + r/2);

        if (isClone) {
            idx = (idx + 3) % 5;
        }
    }
    
    if (n === 7) {
        const angle = 2 * Math.PI / 6;
        const x = xoff + r*3/8 + r2 * Math.sin(angle) * cos60 * 6;
        const y = yoff + r*3/4 + r2 * (-Math.cos(angle)+1) * cos60;
        ctx.fillText("/ "+namesList[(idx + 1) % n], x, y);
    }
}


function getMyDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.`;
}
console.log("Ende µs", 1000 * (window.performance.now() - start) | 0);
