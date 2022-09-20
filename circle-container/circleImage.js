 
export default class CircleImage {
    constructor(selector, posX, posY, r, imageUrl) {
        this.element = document.querySelector(selector);
        this.posX = posX;
        this.posY = posY;
        this.r = r;

        this.element.style.top = this.posY + 'px';
        this.element.style.left = this.posX + 'px';
        this.element.style.width = 2 * r + 'px';
        this.element.style.height = 2 * r + 'px';
        this.setImageClass('image');
        this.setImageUrl(imageUrl);
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