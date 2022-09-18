//
function getPointShadowAfterRotate(pointX, pointY, hPointX, hPointY, rad) {
    return {
        posX: (pointX - hPointX) * Math.cos(rad) - (this.posY - pointY) * Math.sin(rad) + hPointY,
        posY: (pointX - hPointX) * Math.sin(rad) - (this.posY - pointY) * Math.cos(rad) + hPointY
    };
}

//
class CircleContainer {
    constructor(posX, posY, r, clockwise) {
        this.posX = posX;
        this.posY = posY;
        this.r = r;
        this.setDefaultClockwise(clockwise);
        this.setCircularArcLength(0.25);
        this.setAnimationTime(300);
        this.setAnimationStep(30);
        this.setCircleImagesPoint();
        this.setListCircle();
        this.timeStep = this.time / this.step;
        this.inAnimation = false;
    }

    setCircleImagesPoint() {
        this.mainPoint = {
            posX: this.posX - this.r,
            posY: this.posY
        };
        this.topPoint = this.pointAfterRotate(this.mainPoint, - Math.PI / 6);
        this.bottomPoint = this.pointAfterRotate(this.mainPoint,  Math.PI / 6);
        this.hiddenPoint = this.pointAfterRotate(this.mainPoint, - Math.PI / 3);
    }

    setListCircle() {

        this.circle1 = new CircleImage('.circle.circle-1', this.hiddenPoint.posX, this.hiddenPoint.posY, 50);
        this.circle2 = new CircleImage('.circle.circle-2', this.topPoint.posX, this.topPoint.posY, 50);
        this.circle3 = new CircleImage('.circle.circle-3', this.mainPoint.posX, this.mainPoint.posY, 50);
        this.circle4 = new CircleImage('.circle.circle-4', this.bottomPoint.posX, this.bottomPoint.posY, 50);

        this.listCircleImage = [
           {
            circle: this.circle1,
            listPoint: []
           },
           {
            circle: this.circle2,
            listPoint: []
           } ,
           {
            circle: this.circle3,
            listPoint: []
           } ,
           {
            circle: this.circle4,
            listPoint: []
           } 
        ];
           
    }

    setCircularArcLength(distance) {
        this.circularArcLength = distance;
    }
    setDefaultClockwise(isClockwise) {
        this.defaultClockwise = isClockwise;
        this.setClockwise(isClockwise);
    }
    setClockwise(isClockwise) {
        this.clockwise = isClockwise ? 1 : -1;
    }

    setAnimationTime(time) {
        this.time = time;
        this.setTimeOfAnimationStep();
    }

    setAnimationStep(step) {
        this.step = step;
        this.setTimeOfAnimationStep();
    }
    setTimeOfAnimationStep() {
        this.timeStep = this.time / this.step;
    }
    pointAfterRotate(point, rad) {
        console.log(this.clockwise, rad);

        rad = this.clockwise * rad;
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

    setImagesPointsForAnimation() {
        if (this.listCircleImage.length === 0) { return }
        this.listCircleImage = this.listCircleImage.map(function (image) {

            return {
                circle: image.circle,
                listPoint: this.listPointAfterRotate(image.circle.getPoint(), this.circularArcLength * 2 * Math.PI)
            }
        }.bind(this));
    }

    setListImageUrl (listImagesUrl) {
        this.listImagesUrl = [];
    }
    changeImageStep(step) {
        this.imageStep = step;
        if(step < 0) {
            this.setClockwise(!this.defaultClockwise);
        }
        this.setClockwise(this.defaultClockwise);
    }
    

    startAnimation() {
        this.setImagesPointsForAnimation();

        let rotate = null;
        let count = 0;
        clearInterval(rotate);
        this.inAnimation = true;
        rotate = setInterval(function () {
            if (count == this.step) {
                clearInterval(rotate);
                let lastImage = this.listCircleImage.pop();
                this.listCircleImage.unshift(lastImage);
                this.listCircleImage[0].circle.setPoint(this.hiddenPoint.posX, this.hiddenPoint.posY);
                this.inAnimation = false;
            } else {

                count++;
                this.listCircleImage.forEach(item => {
                    item.circle.setPoint(item.listPoint[count].posX, item.listPoint[count].posY)
                })
            }

        }.bind(this), this.timeStep);
        
    }
}
class CircleImage {
    constructor(selector, posX, posY, r) {
        this.element = document.querySelector(selector);
        this.posX = posX;
        this.posY = posY;
        this.r = r;

        this.element.style.top = this.posY + 'px';
        this.element.style.left = this.posX + 'px';
        this.element.style.width = 2 * r + 'px';
        this.element.style.height = 2 * r + 'px';

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
        this.element.querySelector('.' + imageClass).url = imageUrl;
    }

}

let circleContainer = new CircleContainer(500, 400, 400, true);
circleContainer.setAnimationTime(3000);
circleContainer.setAnimationStep(300);
circleContainer.setCircularArcLength(0.08333333334);

const btn = document.getElementById('qqbtn');
btn.addEventListener('click', function () {
    if(!circleContainer.inAnimation) {
        circleContainer.startAnimation();
    }
});




