function Boss() {
  this.size = 2;
  this.pickupradius = 100;
  this.x = SCREEN_WIDTH / 2;
  this.y = -100;
  this.hp = 25;
  this.angles = [
    degToRadians(270),
    degToRadians(342),
    degToRadians(54),
    degToRadians(126),
    degToRadians(198)
  ];
  this.orbiters = [];
  this.alive = false;
  this.intro_over = false;
  this.type = 'enemy';
  this.max_orbiters = 20;
  this.throes = 5;
  this.last_resort = false;
}

Boss.prototype.reset = function() {
  this.alive = true;
  this.x = SCREEN_WIDTH / 2;
  this.y = -50;
  this.intro_over = false;
  this.angles = [
    degToRadians(270-180),
    degToRadians(342-180),
    degToRadians(54-180),
    degToRadians(126-180),
    degToRadians(198-180)
  ];
  this.cooldown = 0;
  this.hp = 25;
  this.throes = 5;
  this.firing = false;
  this.last_resort = false;
  for (var i=0; i<5; i++) {
    this.addOrbiter();
  }
}

Boss.prototype.calculatePoints = function() {
  points = [];
  for (var i=0; i<this.angles.length; ++i) {
    pt = {
      x: this.x + this.pickupradius * Math.cos(this.angles[i]),
      y: this.y + this.pickupradius * Math.sin(this.angles[i])
    };
    points.push(pt);
  } 
  return points;
}

Boss.prototype.death_throes = function() {
  boss.radialShoot(72);
  boss.throes--;
  if (boss.throes <= 0) {
    boss.die();
  } else {
    setTimeout(boss.death_throes, 1000);
  }
}

Boss.prototype.update = function() {
  if (this.intro_over) {
    for (var i=0; i<this.angles.length; ++i) {
      this.angles[i] -= Math.PI / 180;
    }
    for (var i=this.orbiters.length-1; i>=0; --i) {
      this.orbiters[i].update();
      this.orbiters[i].r = this.pickupradius * Math.sin(timer * Math.PI / 90);
      if (this.firing) {
        this.cooldown++;
        this.orbiters[i].shoot(enemy_projectiles, player);
        if (this.cooldown > 500) {
          this.firing = false;
        }
      } else {
        this.cooldown--;
        if (this.cooldown <= 0) {
          this.firing = true;
        }
      }
      if (!this.orbiters[i].alive) {
        this.orbiters.splice(i, 1);
        if (this.orbiters.length == 0) {
          this.last_resort = true;
        }
      }
    }
    if (this.last_resort) {
      this.shoot();
      if (this.hp <= 0) {
        this.last_resort = false;
        setTimeout(this.death_throes, 1);
      }
    }
  } else {
    this.y++;
    if (this.y >= SCREEN_HEIGHT / 2) {
     this.intro_over = true;
    }
  }
}

Boss.prototype.draw = function() {
  if(this.last_resort) {
    noStroke();
    fill(255 - 255 * Math.sin(timer  * Math.PI / 90), 0, 0);
    ellipse(this.x, this.y, this.size);
  }
  strokeWeight(1 + Math.sin(timer * Math.PI / 90));
  stroke(255 - Math.sin(timer * Math.PI / 90) * 255, 0, 0);
  noFill();
  var points = this.calculatePoints();
  line(points[0].x, points[0].y, points[2].x, points[2].y);
  line(points[2].x, points[2].y, points[4].x, points[4].y);
  line(points[4].x, points[4].y, points[1].x, points[1].y);
  line(points[1].x, points[1].y, points[3].x, points[3].y);
  line(points[3].x, points[3].y, points[0].x, points[0].y);
  for (var i=this.orbiters.length-1; i>=0; --i) {
    this.orbiters[i].draw();
  }
}


Boss.prototype.shoot = function(angle) {
  var X = this.x;
  var Y = this.y;
  var dx = player.x - X;
  var dy = player.y - Y;
  var theta, s = 5;
  if (angle === undefined) {
    if (dx == 0) {
      if (dy > 0) {
        theta = Math.PI / 2;
      } else {
        theta = 3 * Math.PI / 2;
      }
    } else {
      theta = Math.atan(dy/dx);
      if (X > player.x) {
        theta += Math.PI;
      }
    }
  } else {
    theta = angle;
    s = 7;
  }
  this.cooldown = player.reload_time;
    enemy_projectiles.push({
      x: X,
      y: Y,
      x_speed: 5 * Math.cos(theta),
      y_speed: 5 * Math.sin(theta),
      size: s
    });
}

Boss.prototype.radialShoot = function(num_bullets) {
  for (var theta = 0; theta <= Math.PI * 2; theta += Math.PI * 2 / num_bullets) {
    this.shoot(theta);
  }
}

Boss.prototype.addOrbiter = function() {
  if (this.orbiters.length < this.max_orbiters) {
    var new_orbiter = new Orbiter(this);
    if (!this.intro_over) {
      if (this.orbiters.length == 0) {
        new_orbiter.theta = Math.PI / 2;
      } else {
        new_orbiter.theta = this.orbiters[this.orbiters.length - 1].theta + Math.PI / 2.5;
      }
    } else {
      new_orbiter.theta = Math.random() * Math.PI * 2;
    }
    new_orbiter.r = this.pickupradius;
    new_orbiter.speed = Math.PI / 72;
    this.orbiters.push(new_orbiter);
  }
}

Boss.prototype.die = function() {
  this.alive = false;
  this.orbiters = [];
}
