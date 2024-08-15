export class Vector2D extends Array<number> {
    constructor(x: number = 1, y: number = 0) {
        super(x, y);
    }

    set x(v) {
        this[0] = v;
    }

    set y(v) {
        this[1] = v;
    }

    get x() {
        return this[0];
    }

    get y() {
        return this[1];
    }

    override get length(): number {
        return Math.hypot(this.x, this.y);
    }

    get dir() {
        return Math.atan2(this.y, this.x);
    }

    copy(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    add(v: Vector2D): Vector2D {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v: Vector2D): Vector2D {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    scale(a: number): Vector2D {
        this.x *= a;
        this.y *= a;
        return this;
    }

    cross(v: Vector2D) {
        return this.x * v.y - v.x * this.y;
    }

    dot(v: Vector2D) {
        return this.x * v.x + v.y * this.y;
    }

    normalize() {
        return this.scale(1 / this.length);
    }

    rotate(rad: number) {
        const c = Math.cos(rad),
            s = Math.sin(rad);
        const [x, y] = this;

        this.x = x * c + y * -s;
        this.y = x * s + y * c;

        return this;
    }
}