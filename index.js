//
function getPointShadowAfterRotate(pointX, pointY, hPointX, hPointY, rad) {
    return {
        posX: (pointX - hPointX) * Math.cos(rad) - (this.posY - pointY) * Math.sin(rad) + hPointY,
        posY: (pointX - hPointX) * Math.sin(rad) - (this.posY - pointY) * Math.cos(rad) + hPointY
    };
}

//
class CircleContainer {
    constructor(querySelector, posX, posY, r, clockwise, listImagesUrl, circularArcLength) {
        this.setElement(querySelector);
        this.posX = posX;
        this.posY = posY;
        this.r = r;
        this.setListImageUrl(listImagesUrl);
        this.setDefaultClockwise(clockwise);
        this.setCircularArcLength(0.25);
        this.setDefaultAnimationTime(300);
        this.setDefaultAnimationStep(30);
        this.setCircularArcLength(circularArcLength);
        this.setListCircleImage();
        this.timeStep = this.time / this.step;
        this.inAnimation = false;
        this.mainImagePos = 0

    }
    setElement(querySelector) {
        if (typeof (querySelector) == 'string') {
            this.element = document.querySelector(querySelector);
        }
        if (typeof (selector) == 'object') {
            this.element = querySelector;
        }
    }

    getImageElements() {
        return this.element.querySelectorAll('.circle-image');
    }

    setListCircleImage() {
        let rad = this.convertCircularArcLengthToRad(this.circularArcLength);
        this.mainPoint = {
            posX: this.posX - this.r,
            posY: this.posY
        };
        let circleImages = this.getImageElements();
        this.circleImages = [];
        circleImages.forEach(function (item, index) {

            let itemEndPointPos = this.pointAfterRotate(this.mainPoint, index * rad);
            if (index == circleImages.length - 1) {
                itemEndPointPos = this.pointAfterRotate(this.mainPoint, this.clockwise * rad);
            }
            this.circleImages.push({
                circle: new CircleImage(item, itemEndPointPos.posX, itemEndPointPos.posY, 50),
                listPoint: [],
            });
        }.bind(this));

        this.circleImagesInAnimate = [];
        this.circleImagesInAnimate.push(this.circleImages[0], this.circleImages[1], this.circleImages[this.circleImages.length - 1]);

    }

    setCircularArcLength(distance) {
        this.circularArcLength = distance;
    }
    setDefaultClockwise(isClockwise) {
        this.defaultClockwise = isClockwise ? 1 : -1;;
        this.setClockwise(isClockwise);
    }
    setClockwise(isClockwise) {
        this.clockwise = isClockwise ? 1 : -1;
    }
    setDefaultAnimationTime(time) {
        this.defaultTime = time;
        this.setAnimationTime(time);
    }
    setAnimationTime(time) {
        this.time = time;
        this.setTimeOfAnimationStep();
    }
    setDefaultAnimationStep(step) {
        this.defaultStep = step;
        this.setAnimationStep(step);
    }
    setAnimationStep(step) {
        this.step = step;
        this.setTimeOfAnimationStep();
    }
    setTimeOfAnimationStep() {
        this.timeStep = this.time / this.step;
    }
    pointAfterRotate(point, rad) {
        rad = -1 * this.clockwise * rad;
        return {
            posX: (point.posX - this.posX) * Math.cos(rad) - (point.posY - this.posY) * Math.sin(rad) + this.posX,
            posY: (point.posX - this.posX) * Math.sin(rad) + (point.posY - this.posY) * Math.cos(rad) + this.posY
        }
    }
    listPointAfterRotate(point, rad) {
        let arr = [];
        let radStep = rad / this.step;
        for (let i = 0; i <= this.step; i++) {
            arr.push(this.pointAfterRotate(point, i * radStep));
        }
        return arr;
    }

    setImagesPointsForAnimation(number) {
        if (this.circleImages.length === 0) { return }
        this.circleImagesInAnimate.push()
        this.addImagesMuchShowInAnimate(number);
        console.log(this.circleImagesInAnimate);
        this.circleImagesInAnimate = this.circleImagesInAnimate.map(function (index, image) {
            console.log(image);
            return {
                circle: image.circle,
                listPoint: this.listPointAfterRotate(image.circle.getPoint(), number * this.convertCircularArcLengthToRad(this.circularArcLength)),
            }
        }.bind(this, number));

    }

    convertImagePosition(pos) {
        if (pos == this.circleImages.length) {
            return 0;
        }
        if (pos > this.circleImages.length) {
            return pos - this.circleImages.length - 1;
        }
        if (pos < 0) {
            return this.circleImages.length + pos - 1;
        }

        return pos;
    }
    addImagesMuchShowInAnimate(number) {
        for (let i = 1; i <= number; i++) {
            let imagePosition = this.mainImagePos + number * this.clockwise;
            imagePosition = this.convertImagePosition(imagePosition);
            let imageMuchShow = this.circleImages[imagePosition];
            imageMuchShow.circle.show();
            this.circleImagesInAnimate.push(imageMuchShow);
        }
    }
    removeImageAfterAnimate(number) {
        let spliceItem = this.clockwise == 1 ? 2 : 1;
        let removeImages = this.circleImagesInAnimate.splice(0, number);
        removeImages.forEach(function (item) {
            item.circle.hidden();
        });
    }
    updateCircleImageMainPosition(number) {
        this.mainImagePos = number * this.mainImagePos + this.clockwise;
    }

    convertCircularArcLengthToRad(circularArcLength) {
        return circularArcLength * 2 * Math.PI;
    }

    setListImageUrl(listImagesUrl) {
        this.listImagesUrl = listImagesUrl;
        this.imagesLength = listImagesUrl.length;
    }
    changeImageStep(step) {
        this.imageStep = step;
        if (step < 0) {
            this.clockwise = -this.defaultClockwise;
        }
        this.clockwise = this.defaultClockwise;
    }


    startAnimation(number) {
        let numberAbs = Math.abs(number);
        let isClockwise = number / numberAbs == -1 ? false : true;
        this.setDefaultClockwise(isClockwise);
        this.updateCircleImageMainPosition(numberAbs);
        if (numberAbs !== 1) {
            this.setAnimationTime(this.defaultTime / numberAbs);
            this.setAnimationStep(this.defaultStep / numberAbs);
        }
        this.setImagesPointsForAnimation(numberAbs);
        let rotate = null;
        let count = 0;
        clearInterval(rotate);
        this.inAnimation = true;
        rotate = setInterval(function () {
            if (count == this.step) {
                clearInterval(rotate);
                this.inAnimation = false;
            } else {

                count++;
                this.circleImagesInAnimate.forEach(item => {
                    item.circle.setPoint(item.listPoint[count].posX, item.listPoint[count].posY)
                })
            }

        }.bind(this), this.timeStep);
        this.removeImageAfterAnimate(number)
    }

}
class CircleImage {
    constructor(selector, posX, posY, r, imageUrl = 'https://via.placeholder.com/150') {

        this.posX = posX;
        this.posY = posY;
        this.r = r;
        this.setElement(selector);
        this.setDefaultStyle();
        this.setImageClass('image');
        this.setImageUrl(imageUrl);
    }
    hidden() {
        this.element.classList.add('hidden');
    }
    show() {
        this.element.classList.remove('hidden')
    }
    setDefaultStyle() {
        this.element.style.top = this.posY + 'px';
        this.element.style.left = this.posX + 'px';
        this.element.style.width = 2 * this.r + 'px';
        this.element.style.height = 2 * this.r + 'px';
    }

    setElement(selector) {
        if (typeof (selector) == 'string') {
            this.element = document.querySelector(selector);
        }
        if (typeof (selector) == 'object') {
            this.element = selector;
        }

    }

    setPoint(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.element.style.top = posY + 'px';
        this.element.style.left = posX + 'px';
    }
    getPoint() {
        return {
            posX: this.posX,
            posY: this.posY
        }
    }

    setImageClass(imageClass) {
        this.imgTagClass = imageClass;
    }

    setImageUrl(imageUrl) {
        this.element.querySelector('.' + this.imgTagClass).src = imageUrl;
    }

}
let listImagesUrl = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg',
    'https://www.rd.com/wp-content/uploads/2021/01/GettyImages-1175550351.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Feral_cat_Virginia_crop.jpg/800px-Feral_cat_Virginia_crop.jpg',
    'https://media.wired.com/photos/5cdefb92b86e041493d389df/1:1/w_988,h_988,c_limit/Culture-Grumpy-Cat-487386121.jpg',
    'https://static01.nyt.com/images/2019/10/01/science/00SCI-CATS1/00SCI-CATS1-facebookJumbo.jpg?year=2019&h=549&w=1050&s=a12758d1b750010957f6d8dcafd0fb707ac2f98675c4cd264adc01b93205d41e&k=ZQJBKqZ0VN'
];
let circleContainer = new CircleContainer('.circle-container', 500, 400, 400, false, listImagesUrl, 0.125);
circleContainer.setDefaultAnimationTime(500);
circleContainer.setDefaultAnimationStep(100);
const nextBtn = document.getElementById('qqbtn');
const prevBtn = document.getElementById('qqjztrbtn');


nextBtn.addEventListener('click', function () {
    if (!circleContainer.inAnimation) {
        circleContainer.startAnimation(-1);
    }
});

prevBtn.addEventListener('click', function () {
    if (!circleContainer.inAnimation) {
        circleContainer.startAnimation(1);
    }
});



