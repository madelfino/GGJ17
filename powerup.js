var powerup_types = [
  'speed',
  'align',
  'radial',
  'shield',
  'line'
];

function Powerup(info) {
  this.x = info.x;
  this.y = info.y;
  this.type = powerup_types[Math.floor(Math.random() * powerup_types.length)];
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
  ellipse(this.x, this.y, fluctuate(this.size, 1.5, 4));
}
