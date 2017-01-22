function Powerup(info) {
  this.x = info.x;
  this.y = info.y;
  this.size = 20;
  this.alive = true;
  this.ttl = 300;
  this.speed = 0.5;
}

Powerup.prototype.update = function() {
  this.ttl--;
  if (this.ttl <= 0) {
    this.alive = false;
  }
  if (this.x < player.x) {
    this.x += this.speed;
  }
  if (this.x > player.x) {
    this.x -= this.speed;
  }
  if (this.y < player.y) {
    this.y += this.speed;
  }
  if (this.y > player.y) {
    this.y -= this.speed;
  }
}

Powerup.prototype.draw = function() {
  fill(Math.random() * 255, Math.random() * 255, Math.random() * 255);
  noStroke();
  ellipse(this.x, this.y, this.size);
}
