import CircleContainer from './circle-container/circle-container.js';


let circleContainer = new CircleContainer(500, 400, 400);


const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');


nextBtn.addEventListener('click', function () {
    if (!circleContainer.inAnimation) {
        circleContainer.rotateNAnimation(-1);
    }
});

prevBtn.addEventListener('click', function () {
    if (!circleContainer.inAnimation) {
        circleContainer.rotateNAnimation(1);
    }
});



