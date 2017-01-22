function Orbiter(controller) {
  this.controller = controller;
  this.color = 'green';
  this.r = 40;
  this.speed = Math.PI / 45;
  this.theta = 0;
  this.x = controller.x;
  this.y = controller.y + this.r;
  this.size = 20;
  this.alive = true;
  this.hp = 50;
}

Orbiter.prototype.update = function() {
  this.theta += this.speed;
  this.x = this.controller.x + this.r * Math.cos(this.theta);
  this.y = this.controller.y + this.r * Math.sin(this.theta);
  if (this.hp <= 0) {
    this.alive = false;
  }
};

Orbiter.prototype.shoot = function(projectiles, target) {
  var s = 5;
  if (target === undefined) {
    target = {
      x: mouseX,
      y: mouseY
    };
  } else {
    s = 10;
  }
  var dx = Math.abs(target.x - this.x);
  var dy = Math.abs(target.y - this.y);
  var vx, vy;
  if (dx > dy) {
    vy = 0;
    if (target.x > this.x) {
      vx = 10;
    } else {
      vx = -10;
    }
  } else {
    vx = 0;
    if (mouseY > this.y) {
      vy = 10;
    } else {
      vy = -10;
    }
  }
  projectiles.push({
    x: this.x,
    y: this.y,
    x_speed: vx,
    y_speed: vy,
    size: s,
    color: 'red'
  });
};

Orbiter.prototype.draw = function() {
  noStroke();
  if (this.controller.type == 'player') {
    fill(Math.random()*255, Math.random()*255, Math.random()*255);
  } else if (this.controller.type == 'enemy') {
    fill(255 - 155 * Math.sin(timer * Math.PI / 90), 0, 0);
  }
  ellipse(this.x, this.y, this.size);
};
