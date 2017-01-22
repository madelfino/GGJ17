function Player() {
  this.x = 600;
  this.y = 800;
  this.speed = 3;
  this.reload_time = 1;
  this.cooldown = 0;
  this.projectiles = [];
  this.orbiters = [];
  this.size = 2;
  this.score = 0;
  this.pickupradius = 50;
  this.max_orbiters = 6;
  this.alive = true;
  this.type = 'player';
}

Player.prototype.setup = function() {
  var num_orbiters = 1;
  for (var i=0; i<num_orbiters; ++i) {
    this.addOrbiter();
  } 
}

Player.prototype.update = function() { 

  var buffer = 50;

  if (keyIsDown(W_KEY) && this.y - buffer > 0) {
    this.y -= this.speed;
  }
  if (keyIsDown(S_KEY) && this.y + buffer < SCREEN_HEIGHT) {
    this.y += this.speed;
  } 
  if (keyIsDown(D_KEY) && this.x + buffer < SCREEN_WIDTH) {
    this.x += this.speed;
  }
  if (keyIsDown(A_KEY) && this.x - buffer > 0) {
    this.x -= this.speed;
  }
  if (player.cooldown > 0) {
    this.cooldown--;
  }
  if (this.cooldown <= 0) {
    this.shoot();
  }
  for (var i=0; i<this.orbiters.length; ++i) {
    this.orbiters[i].update();
  }
}

Player.prototype.shoot = function(angle) {
  var X = this.x;
  var Y = this.y;
  var dx = mouseX - X;
  var dy = mouseY - Y;
  var theta;
  if (angle === undefined) {
    if (dx == 0) {
      if (dy > 0) {
        theta = Math.PI / 2;
      } else {
        theta = 3 * Math.PI / 2;
      }
    } else {
      theta = Math.atan(dy/dx);
      if (X > mouseX) {
        theta += Math.PI;
      }
    }
  } else {
    theta = angle;
  }
  this.cooldown = player.reload_time;
  if (this.orbiters.length == 0) {
    var s = 2;
    if (!this.alive) s = 7;
    this.projectiles.push({
      x: X,
      y: Y,
      x_speed: 5 * Math.cos(theta),
      y_speed: 5 * Math.sin(theta),
      size: s
    });
  }
  for (var i = 0; i < player.orbiters.length; ++i) {
    player.orbiters[i].shoot(player.projectiles);
  }
}

Player.prototype.draw = function() {

  noStroke();
  fill(0, 255, 0);
  ellipse(player.x, player.y, player.size);

  noFill();
  strokeWeight(1);
  stroke(155 - 55 * Math.sin(timer * Math.PI / 90), 155, 155 - 55 * Math.sin(timer * Math.PI / 90));
  ellipse(player.x, player.y, player.pickupradius);
  
  for (var i=0; i<this.orbiters.length; ++i) {
    this.orbiters[i].draw();
  }

  textAlign(LEFT);
  textSize(24);
  text("Score: " + this.score, 25, 25);
}

Player.prototype.radialShoot = function(num_bullets) {
  for (var theta = 0; theta <= Math.PI * 2; theta += Math.PI * 2 / num_bullets) {
    this.shoot(theta);
  }
}

Player.prototype.hit = function() {
  if (this.orbiters.length > 0) {
    this.orbiters.splice(Math.floor(Math.random() * this.orbiters.length), 1);
  } else {
    if (this.alive) {
      this.alive = false;
      this.radialShoot(72);
      this.radialShoot(72);
    }
  }
}

Player.prototype.addOrbiter = function() {
  if (this.orbiters.length < this.max_orbiters) {
    var new_orbiter = new Orbiter(this);
    new_orbiter.theta = Math.random() * 2 * Math.PI;
    new_orbiter.speed = Math.PI / 180 + Math.random() * Math.PI / 30;
    new_orbiter.r = 10 + Math.random() * 60;
    this.orbiters.push(new_orbiter);
  }
}
