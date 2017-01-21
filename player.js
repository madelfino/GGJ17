function Player() {
  this.x = 600;
  this.y = 800;
  this.speed = 3;
  this.reload_time = 1;
  this.cooldown = 0;
  this.projectiles = [];
  this.orbiters = [];
  this.size = 5;
  this.score = 0;
}

Player.prototype.setup = function() {
  var num_orbiters = 1;
  for (var i=0; i<num_orbiters; ++i) {
    this.orbiters.push(new Orbiter(this));
    this.orbiters[i].theta = Math.random() * 2 * Math.PI;
    this.orbiters[i].speed = Math.PI / 180 + Math.random() * Math.PI / 30;
  } 
}

Player.prototype.update = function() { 

  if (keyIsDown(W_KEY)) {
    this.y -= this.speed;
  }

  if (keyIsDown(S_KEY)) {
    this.y += this.speed;
  }
  
  if (keyIsDown(D_KEY)) {
    this.x += this.speed;
  }
  
  if (keyIsDown(A_KEY)) {
    this.x -= this.speed;
  }
  
  if (player.cooldown > 0) {
    this.cooldown--;
  }

  if (mouseIsPressed && this.cooldown <= 0) {
    var X = this.x;
    var Y = this.y;
    var dx = mouseX - X;
    var dy = mouseY - Y;
    var theta;
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
    this.cooldown = player.reload_time;
    this.projectiles.push({
      x: X,
      y: Y,
      x_speed: 5 * Math.cos(theta),
      y_speed: 5 * Math.sin(theta),
      color: '#ff0000'
    });
    for (var i = 0; i < player.orbiters.length; ++i) {
      player.orbiters[i].shoot(player.projectiles);
    }
  }

 
  for (var i=0; i<this.orbiters.length; ++i) {
    this.orbiters[i].update();
  }
}

Player.prototype.draw = function() {

  noStroke();
  fill(0, 255, 0);
  ellipse(player.x, player.y, player.size);
  
  for (var i=0; i<this.orbiters.length; ++i) {
    this.orbiters[i].draw();
  }

  textAlign(LEFT);
  textSize(24);
  text("Score: " + this.score, 25, 25);
}
