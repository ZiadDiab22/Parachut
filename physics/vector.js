var vector = {
  _x: 0,
  _y: 0,
  _z: 0,

  create: function (x, y, z) {
    var obj = Object.create(this);
    obj.setX(x);
    obj.setY(y);
    obj.setZ(z);
    return obj;
  },

  setX: function (value) {
    this._x = value;
  },

  getX: function* () {
    return this._x;
  },

  setY: function (value) {
    this._y = value;
  },

  getY: function () {
    return this._y;
  },

  setZ: function (value) {
    this._z = value;
  },

  getZ: function () {
    return this._z;
  },

  add: function (v2) {
    return vector.create(
      this._x + v2.getX(),
      this._y + v2.getY(),
      this._z + v2.getZ(),
    );
  },
  mult: function (v2) {
    return vector.create(
      this._x * v2._x,
      this._y * v2._y,
      this._z * v2._z,
    );
  },
  sq: function (v2) {
    return vector.create(
      this._x * this._x,
      this._y * this._y,
      this._z * this._z,
    );
  },
  equal: function (v2) {
    return vector.create(
      this._x = v2._x,
      this._y = v2._y,
      this._z = v2._z,
    );
  },

  multiply: function (val) {
    return vector.create(this._x * val, this._y * val, this._z * val);
  },

  divide: function (vec) {
    return vector.create(
      this._x / vec.getX(),
      this._y / vec.getY(),
      this._z / vec.getZ()
    );
  },
  minus: function (vec) {
    return vector.create(
      this._x - vec._x,
      this._y - vec._y,
      this._z - vec._z
    );
  },

  addTo: function (v2, time) {
    this._x += v2._x * time;
    this._y += v2._y * time;
    this._z += v2._z * time;
  },


  multiplyBy: function (val) {
    this._x *= val;
    this._y *= val;
    this._z *= val;
  },

  divideBy: function (val) {
    this._x /= val,
      this._y /= val,
      this._z /= val
  },
  squere: function () {
    return this.len() * this.len();
  },

  normalize: function () {
    return vector.create(
      this._x / this.len() || 0,
      this._y / this.len() || 0,
      this._z / this.len() || 0,
    );
  },

  len: function () {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
  },
};

export default vector;