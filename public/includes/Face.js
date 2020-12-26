/**
 *
 *
 */
class Face {
  constructor({x, y, feeling, id} = {}) {
    this.id = id;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.vel.limit(5);
    this.acc = createVector(0, 0);
    this.feeling = feeling;
    this.feelingValue = 1;
  }

  stop() {
    this.vel.set(0, 0);
  }

  run() {
    this.attract();
    this.updatePosition();
    this.draw();
  }

  attract() {
    const others = players.filter(
        (p) => p.feeling === this.feeling && p.id !== this.id);

    for (const other of others) {
      /**
       *
       * @type {p5.Vector} force
       */
      const force = p5.Vector.sub(this.pos, other.pos);

      let distance = force.mag();

      if (distance < 10 ) return;

      if (distance < 150) distance *= distance;

      force.setMag(
          G * this.feelingValue * other.feelingValue / pow(distance, 2));

      other.applyForce(force);
    }
  }

  /**
   *
   * @param {p5.Vector} force
   */
  applyForce(force) {
    const acceleration = force.div(this.feelingValue);
    this.acc.add(acceleration);
  }

  updatePosition() {
    this.vel.add(this.acc);
    this.vel.limit(4.5);

    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  set expressions(expressions) {
    this.feeling = '';
    this.feelingValue = 0;

    for (const [feeling, value] of Object.entries(expressions)) {
      if (value > this.feelingValue) {
        this.feeling = feeling;
        this.feelingValue = value;
      }
    }
  }

  set landmarks({_positions}) {
    this.shape = _positions.slice(0, 17);
    this.leftEyebrow = _positions.slice(17, 22);
    this.rightEyebrow = _positions.slice(22, 27);
    this.nose = _positions.slice(27, 36);
    this.leftEye = _positions.slice(36, 42);
    this.rightEye = _positions.slice(42, 48);
    this.mouth = _positions.slice(48, 68);
  }

  draw() {
    // Se non c'è ancora un feeling associato, non disegnare.
    if (!this.feeling) {
      return;
    }

    push();

    const col = palette[this.feeling];

    const lerpedColor = lerpColor(
        color('white'), // Colore di partenza, se il valore fosse 0.
        color(col), // Colore se il valore fosse 1.
        this.feelingValue,
    );

    fill(lerpedColor);

    ellipse(this.pos.x, this.pos.y, 20);

    // push();
    // translate(this.pos);
    // line(0, 0, this.vel.x, this.vel.y);
    // pop();
    // this._drawElement(this.shape, false);
    // this._drawElement(this.leftEyebrow, false);
    // this._drawElement(this.rightEyebrow, false);
    // this._drawElement(this.nose, false);
    // this._drawElement(this.leftEye);
    // this._drawElement(this.rightEye);
    // this._drawElement(this.mouth);

    pop();
  }

  _drawElement(points, close = true) {
    for (let i = 0; i < points.length - 1; i++) {
      const pos = points[i];
      const next = points[i + 1];
      scribble.scribbleLine(pos._x, pos._y, next._x, next._y);
    }
    close && scribble.scribbleLine(
        points[0]._x, points[0]._y,
        points[points.length - 1]._x, points[points.length - 1]._y,
    );
  }
}

