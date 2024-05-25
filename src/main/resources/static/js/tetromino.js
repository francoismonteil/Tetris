export class Tetromino {
    constructor(type, shape, x, y) {
        this.type = type;
        this.shape = shape;
        this.x = x;
        this.y = y;
    }

    rotate() {
        this.shape = this.shape[0].map((val, index) =>
            this.shape.map(row => row[index]).reverse()
        );
    }
}
