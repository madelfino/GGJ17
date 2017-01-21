function Enemy(type) {
  this.type = type;
  this.alive = true;
  this.size = 15;
  this.color = 'red';
  this.fire_rate = 10;
  this.speed = 3;
  this.direction = Math.floor(Math.random() * 4);
  if (this.direction == 0) {
    this.x = - this.size - 1;
    this.y = this.size + Math.random() * (SCREEN_HEIGHT - this.size);
  } else if (this.direction == 1) {
    this.x = SCREEN_WIDTH + this.size + 1;
    this.y = this.size + Math.random() * (SCREEN_HEIGHT - this.size);
  } else if (this.direction == 2) {
    this.y = - this.size - 1;
    this.x = this.size + Math.random() * (SCREEN_WIDTH - this.size);
  } else {
    this.y = SCREEN_HEIGHT + this.size + 1;
    this.x = this.size + Math.random() * (SCREEN_WIDTH - this.size);
  }
}

Enemy.prototype.update = function() {
  if (this.direction == 0) {
    this.x += this.speed;
    if (this.x + this.size / 2 > SCREEN_WIDTH) this.direction = 1; 
  } else if (this.direction == 1) {
    this.x -= this.speed;
    if (this.x - this.size / 2 < 0) this.direction = 0; 
  } else if (this.direction == 2) {
    this.y += this.speed;
    if (this.y + this.size / 2 > SCREEN_HEIGHT) this.direction = 3; 
  } else {
    this.y -= this.speed;
    if (this.y - this.size / 2 < 0) this.direction = 2; 
  }
};

Enemy.prototype.draw = function() {
  noStroke();
  fill(this.color);
  ellipse(this.x, this.y, this.size);
};

Enemy.prototype.shoot = function(projectiles) {

};

Enemy.prototype.hit = function() {
  this.alive = false;
}
