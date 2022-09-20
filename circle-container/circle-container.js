import CircleImage from './circleImage.js'
export default class CircleContainer {

    defaultTime = 500;
    defaultStep = 80;
    inAnimation = false;
    clockwise = - 1;
    defaultClockwise = -1;
    circularArcLength = 0.125;

    constructor(posX, posY, r) {
        this.posX = posX;
        this.posY = posY;
        this.r = r;
        this.setListImageUrl(null);
        this.setCircleImagesPoint();
        this.setListCircle();
        this.setTimeOfAnimationStep();
        this.setDefaultMainImagePos();
    }

    setDefaultMainImagePos() {
        if (this.clockwise == 1) {
            this.mainImagePos = 2
        } else {
            this.mainImagePos = 1
        }
    }

    setListImageUrl(images) {
        if (images == null) {
            this.listImagesUrl = [
                'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg',
                'https://www.rd.com/wp-content/uploads/2021/01/GettyImages-1175550351.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Feral_cat_Virginia_crop.jpg/800px-Feral_cat_Virginia_crop.jpg',
                'https://media.wired.com/photos/5cdefb92b86e041493d389df/1:1/w_988,h_988,c_limit/Culture-Grumpy-Cat-487386121.jpg',
                'https://static01.nyt.com/images/2019/10/01/science/00SCI-CATS1/00SCI-CATS1-facebookJumbo.jpg?year=2019&h=549&w=1050&s=a12758d1b750010957f6d8dcafd0fb707ac2f98675c4cd264adc01b93205d41e&k=ZQJBKqZ0VN',
                'https://thumbor.bigedition.com/funniest-cats-internet/IFuBq6cGzboq-79yUziXTZkYtw0=/0x13:800x614/480x360/filters:format(webp):quality(80)/granite-web-prod/cc/fa/ccfa37b8659442e9a994fe07d0534ac8.jpeg',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaPnRaUPvLfZOh83q86MwakewvLW615xkJ8w&usqp=CAU',
            ];
        }
        this.imagesLength = this.listImagesUrl.length;
    }
    setCircleImagesPoint() {
        this.mainPoint = {
            posX: this.posX - this.r,
            posY: this.posY
        };
        let rad = this.convertCircularArcLengthToRad(this.circularArcLength);
        this.topPoint = this.pointAfterRotate(this.mainPoint, - rad);
        this.bottomPoint = this.pointAfterRotate(this.mainPoint, rad);
        this.hiddenPoint = this.pointAfterRotate(this.mainPoint, - 2 * rad);
        this.hiddenBottomPoint = this.pointAfterRotate(this.mainPoint, 2 * rad);
    }
    setListCircle() {

        this.circle1 = new CircleImage('.circle.circle-1', this.hiddenPoint.posX, this.hiddenPoint.posY, 50, this.listImagesUrl[3]);
        this.circle2 = new CircleImage('.circle.circle-2', this.topPoint.posX, this.topPoint.posY, 50, this.listImagesUrl[0]);
        this.circle3 = new CircleImage('.circle.circle-3', this.mainPoint.posX, this.mainPoint.posY, 50, this.listImagesUrl[1]);
        this.circle4 = new CircleImage('.circle.circle-4', this.bottomPoint.posX, this.bottomPoint.posY, 50, this.listImagesUrl[2]);

        this.listCircleImage = [
            {
                circle: this.circle1,
                listPoint: [],
                imagePositionInList: 3
            },
            {
                circle: this.circle2,
                listPoint: [],
                imagePositionInList: 0
            },
            {
                circle: this.circle3,
                listPoint: [],
                imagePositionInList: 1
            },
            {
                circle: this.circle4,
                listPoint: [],
                imagePositionInList: 2
            }
        ];

    }

    setCircularArcLength(distance) {
        this.circularArcLength = distance;
    }
    setDefaultClockwise(isClockwise) {
        this.defaultClockwise = isClockwise ? 1 : -1;
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
        let hiddenImage = this.listCircleImage[0];
        if (this.clockwise == 1) {
            hiddenImage = this.listCircleImage.shift(); //shift
            hiddenImage.circle.setPoint(this.hiddenBottomPoint.posX, this.hiddenBottomPoint.posY);
            this.listCircleImage.push(hiddenImage); //push
        }
        hiddenImage.circle.setImageUrl(this.listImagesUrl[this.hiddenImagePos]);
        this.listCircleImage = this.listCircleImage.map(function (image, index) {
            return {
                circle: image.circle,
                listPoint: this.listPointAfterRotate(image.circle.getPoint(), this.convertCircularArcLengthToRad(this.circularArcLength)),
                imagePositionInList: image.imagePositionInList
            }
        }.bind(this));

    }

    convertCircularArcLengthToRad(circularArcLength) {
        return circularArcLength * 2 * Math.PI;
    }
    setMainImagePos() {

        this.mainImagePos = this.mainImagePos + this.clockwise;
        if (this.mainImagePos == this.imagesLength) {
            this.mainImagePos = 0;
        }
        if (this.mainImagePos <= -1) {
            this.mainImagePos = this.imagesLength - 1
        }


    };
    setHiddenImagePos() {
        this.hiddenImagePos = this.mainImagePos + 2 * this.clockwise;

        if (this.hiddenImagePos == this.imagesLength) {
            this.hiddenImagePos = 0;
        }
        if (this.hiddenImagePos > this.imagesLength) {
            this.hiddenImagePos = 1;
        }
        if (this.hiddenImagePos == -1) {
            this.hiddenImagePos = this.imagesLength - 1
        }
        if (this.hiddenImagePos < -1) {
            this.hiddenImagePos = this.imagesLength - 2
        }

    }
    changeImageStep(step) {
        this.imageStep = step;
        if (step < 0) {
            this.clockwise = -this.defaultClockwise;
        }
        this.clockwise = this.defaultClockwise;
    }


    startAnimation() {
        this.setMainImagePos();
        this.setHiddenImagePos();
        this.setImagesPointsForAnimation();
        let rotate = null;
        let count = 0;
        clearInterval(rotate);
        this.inAnimation = true;
        rotate = setInterval(function () {
            if (count == this.step) {
                clearInterval(rotate);
                if (this.clockwise == -1) {
                    let lastImage = this.listCircleImage.pop();
                    this.listCircleImage.unshift(lastImage);
                    this.listCircleImage[0].circle.setPoint(this.hiddenPoint.posX, this.hiddenPoint.posY);
                }
                this.inAnimation = false;
            } else {

                count++;
                this.listCircleImage.forEach(item => {
                    item.circle.setPoint(item.listPoint[count].posX, item.listPoint[count].posY)
                })
            }

        }.bind(this), this.timeStep);
    }
    rotateNAnimation(number) {
        let numberAbs = Math.abs(number);
        let isClockwise = number / numberAbs == -1 ? false : true;
        this.setDefaultClockwise(isClockwise);
        this.setAnimationTime(this.defaultTime / numberAbs);
        this.setAnimationStep(Math.floor(this.defaultStep / numberAbs));

        for (let i = 0; i < numberAbs; i++) {
            setTimeout(function () {
                this.startAnimation();
            }.bind(this), i * this.time);
        }
    }
}