function Orbiter(controller) {
  this.controller = controller;
  this.color = 'green';
  this.r = 40;
  this.speed = Math.PI / 45;
  this.theta = 0;
  this.x = controller.x;
  this.y = controller.y + this.r;
  this.size = 20;
}

Orbiter.prototype.update = function() {
  this.theta += this.speed;
  this.x = this.controller.x + this.r * Math.cos(this.theta);
  this.y = this.controller.y + this.r * Math.sin(this.theta);
};

Orbiter.prototype.shoot = function(projectiles) {
  var dx = Math.abs(mouseX - this.x);
  var dy = Math.abs(mouseY - this.y);
  var vx, vy;
  if (dx > dy) {
    vy = 0;
    if (mouseX > this.x) {
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
    size: 5,
    color: 'red'
  });
};

Orbiter.prototype.draw = function() {
  noStroke();
  fill(Math.random()*255, Math.random()*255, Math.random()*255);
  ellipse(this.x, this.y, this.size);
};
