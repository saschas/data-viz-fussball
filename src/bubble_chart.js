var countries = [
   {name: "frankreich", x: 0.194, y: 0.548, r: 5.8, wins: 3},
   {name: "england", x: 0.144, y: 0.401, r: 3.9, wins: 3},
   {name: "deutschland", x: 0.348, y: 0.475, r: 6.1, wins: 3},
   {name: "italien", x: 0.376, y: 0.640, r: 4.2, wins: 2},
   {name: "belgien", x: 0.242, y: 0.477, r: 1.8, wins: 3},
   {name: "portugal", x: 0.028, y: 0.734, r: 2.3, wins: 3},
   {name: "spanien", x: 0.117, y: 0.655, r: 6.1, wins: 3},
   {name: "rumänien", x: 0.600, y: 0.628, r: 4.0, wins: 0},
   {name: "russland", x: 0.882, y: 0.252, r: 14, wins: 3},
   {name: "ukraine", x: 0.720, y: 0.529, r: 7.6, wins: 3},
   {name: "tschechien", x: 0.446, y: 0.494, r: 2.2, wins: 3},
   {name: "island", x: 0.060, y: 0.163, r: 2.3, wins: 3},
   {name: "albanien", x: 0.521, y: 0.771, r: 1.8, wins: 3},
   {name: "wales", x: 0.101, y: 0.444, r: 1.6, wins: 3},
   {name: "polen", x: 0.517, y: 0.433, r: 4.8, wins: 1},
   {name: "türkei", x: 0.895, y: 0.766, r: 6.9, wins: 3},
   {name: "irland", x: 0.073, y: 0.409, r: 2.3, wins: 3},
   {name: "österreich", x: 0.422, y: 0.556, r: 2.3, wins: 3},
   {name: "schweiz", x: 0.307, y: 0.565, r: 2.3, wins: 3},
   {name: "slowakei", x: 0.530, y: 0.523, r: 2.7, wins: 3},
   {name: "nordirland", x: 0.089, y: 0.361, r: 2.3, wins: 3},
   {name: "kroatien", x: 0.475, y: 0.716, r: 2.3, wins: 3},
   {name: "schweden", x: 0.469, y: 0.208, r: 4.0, wins: 3},
   {name: "ungarn", x: 0.504, y: 0.645, r: 3.5, wins: 3},
   {name: "niederlande", x: 0.253, y: 0.435, r: 1.6, wins: 4},
   {name: "griechenland", x: 0.608, y: 0.83, r: 3.2, wins: 3},
   {name: "dänemark", x: 0.332, y: 0.390, r: 1.6, wins: 3},
   {name: "bulgarien", x: 0.647, y: 0.716, r: 2.9, wins: 3},
   {name: "schottland", x: 0.136, y: 0.325, r: 2.3, wins: 3},
   {name: "lettland", x: 0.624, y: 0.318, r: 1.6, wins: 3},
   {name: "slowenien", x: 0.489, y: 0.575, r: 2.4, wins: 3},
   {name: "norwegen", x: 0.376, y: 0.247, r: 4.0, wins: 3},
   {name: "finnland", x: 0.589, y: 0.198, r: 5., wins: 39}
];

function Ball(r, p, v) {
  this.radius = r;
  this.point = p;
  this.vector = v;
  this.maxVec = 15;
  this.numSegment = Math.floor(r / 3 + 2);
  this.boundOffset = [];
  this.boundOffsetBuff = [];
  this.sidePoints = [];
  this.path = new Path({
    fillColor: {
      hue: Math.random() * 360,
      saturation: 1,
      brightness: 1
    },
    blendMode: 'lighter'
  });

  for (var i = 0; i < this.numSegment; i ++) {
    this.boundOffset.push(this.radius);
    this.boundOffsetBuff.push(this.radius);
    this.path.add(new Point());
    this.sidePoints.push(new Point({
      angle: 360 / this.numSegment * i,
      length: 1
    }));
  }
}

Ball.prototype = {
  iterate: function() {
    this.checkBorders();
    if (this.vector.length > this.maxVec)
      this.vector.length = this.maxVec;
    this.vector.length *= 0.9;
    this.point += this.vector;
    this.updateShape();
  },

  checkBorders: function() {
    var size = view.size;
    if (this.point.x < -this.radius)
      this.point.x = size.width + this.radius;
    if (this.point.x > size.width + this.radius)
      this.point.x = -this.radius;
    if (this.point.y < -this.radius)
      this.point.y = size.height + this.radius;
    if (this.point.y > size.height + this.radius)
      this.point.y = -this.radius;
  },

  updateShape: function() {
    var segments = this.path.segments;
    for (var i = 0; i < this.numSegment; i ++)
      segments[i].point = this.getSidePoint(i);

    this.path.smooth();
    for (var i = 0; i < this.numSegment; i ++) {
      if (this.boundOffset[i] < this.radius / 4)
        this.boundOffset[i] = this.radius / 4;
      var next = (i + 1) % this.numSegment;
      var prev = (i > 0) ? i - 1 : this.numSegment - 1;
      var offset = this.boundOffset[i];
      offset += (this.radius - offset) / 15;
      offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
      this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
    }
  },

  react: function(b) {
    var dist = this.point.getDistance(b.point);
    if (dist < this.radius + b.radius && dist != 0) {
      var overlap = this.radius + b.radius - dist;
      var direc = (this.point - b.point).normalize(overlap * 0.015);
      this.vector += direc;
      b.vector -= direc;

      this.calcBounds(b);
      b.calcBounds(this);
      this.updateBounds();
      b.updateBounds();
    }
  },

  getBoundOffset: function(b) {
    var diff = this.point - b;
    var angle = (diff.angle + 180) % 360;
    return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)];
  },

  calcBounds: function(b) {
    for (var i = 0; i < this.numSegment; i ++) {
      var tp = this.getSidePoint(i);
      var bLen = b.getBoundOffset(tp);
      var td = tp.getDistance(b.point);
      if (td < bLen) {
        this.boundOffsetBuff[i] -= (bLen  - td) / 2;
      }
    }
  },

  getSidePoint: function(index) {
    return this.point + this.sidePoints[index] * this.boundOffset[index];
  },

  updateBounds: function() {
    for (var i = 0; i < this.numSegment; i ++)
      this.boundOffset[i] = this.boundOffsetBuff[i];
  }
};

//--------------------- main ---------------------

var balls = [];
var numBalls = countries.length;
var radiusFactor = view.size.width/120 * view.size.height/1200;
for (var i = 0; i < numBalls; i++) {
  var position = new Point(countries[i].x/1.5, countries[i].y/1.5) * view.size + view.size/6;
  var vector = new Point({
    angle: 0,
    length: 0
  });
  var radius = countries[i].r * radiusFactor;
  balls.push(new Ball(radius, position, vector));
}

function onFrame() {
  for (var i = 0; i < balls.length - 1; i++) {
    for (var j = i + 1; j < balls.length; j++) {
      balls[i].react(balls[j]);
    }
  }
  for (var i = 0, l = balls.length; i < l; i++) {
    balls[i].iterate();
  }
}

$('#show-wins-button').click(function(e) {
  for (var i = 0; i < numBalls; i++) {
    balls[i].radius = countries[i].wins * radiusFactor;
    balls[i].updateBounds();
  }
});

$('#show-start-button').click(function(e) {
  for (var i = 0; i < numBalls; i++) {
    balls[i].radius = countries[i].r * radiusFactor;
    balls[i].updateBounds();
  }
});