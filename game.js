const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 900;

const W_KEY = 87;
const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;

var player = {
  x: 600,
  y: 800,
  speed: 3,
  reload_time: 1,
  cooldown: 0,
  projectiles: [],
  orbiters: [],
  size: 5
};

var enemies = [];
var enemy_projectiles = [];
var spawn_chance = 5;
var num_orbiters = 2;

function distance(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.sqrt(dx*dx + dy*dy);
}

function collides(obj1, obj2) {
  var d = distance(obj1.x, obj1.y, obj2.x, obj2.y);
  return (obj1.size / 2 + obj2.size / 2 > d);
}

function setup() {
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  for (var i=0; i<num_orbiters; ++i) {
    player.orbiters.push(new Orbiter(player));
    player.orbiters[i].theta = Math.random() * 2 * Math.PI;
    player.orbiters[i].speed = Math.PI / 180 + Math.random() * Math.PI / 30;
  }
}

function draw() {
 
  //draw blue background
  background(40, 40, 200);

  if (Math.random() * 100 < spawn_chance) {
    enemies.push(new Enemy('standard'));
  }

  for (var i=enemies.length-1; i>=0; --i) {
    enemies[i].update();
    enemies[i].draw();
    if (!enemies[i].alive) {
      enemies.splice(i, 1);
    }
  }
  
  //draw the player
  noStroke();
  fill(0, 255, 0);
  ellipse(player.x, player.y, player.size);

  fill('green');
  for (var i=0; i<player.orbiters.length; ++i) {
    player.orbiters[i].update();
    player.orbiters[i].draw();
  }
 
  //update player position based on keyboard input
  if (keyIsDown(W_KEY)) {
    player.y -= player.speed;
  }
  
  if (keyIsDown(S_KEY)) {
    player.y += player.speed;
  }
  
  if (keyIsDown(D_KEY)) {
    player.x += player.speed;
  }
  
  if (keyIsDown(A_KEY)) {
    player.x -= player.speed;
  }
  
  if (player.cooldown > 0) {
    player.cooldown--;
  }
  
  if (mouseIsPressed && player.cooldown <= 0) {
    var X = player.x;
    var Y = player.y;
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
    player.cooldown = player.reload_time;
    /*player.projectiles.push({
      x: X,
      y: Y,
      x_speed: 5 * Math.cos(theta),
      y_speed: 5 * Math.sin(theta),
      color: '#ff0000'
    });*/
    for (var i = 0; i < player.orbiters.length; ++i) {
      player.orbiters[i].shoot(player.projectiles);
    }
  }
  
  for (var i = player.projectiles.length - 1; i >= 0; --i) {
    proj = player.projectiles[i];
    fill(Math.random()*255, Math.random()*255, Math.random()*255);
    //fill(player.projectiles[i].color);
    noStroke();
    ellipse(proj.x, proj.y, proj.size);
    player.projectiles[i].x += proj.x_speed;
    player.projectiles[i].y += proj.y_speed;
    if (proj.x > SCREEN_WIDTH || proj.x < 0 || proj.y > SCREEN_HEIGHT || proj.y < 0) {
      player.projectiles.splice(i, 1);
    }
    for (var j=0; j<enemies.length; ++j) {
      if (collides(proj, enemies[j])) {
        enemies[j].hit();
        player.projectiles.splice(i, 1);
      }
    }
  }
  
  //draw cursor
  stroke(255, 0, 0);
  noFill();
  ellipse(mouseX, mouseY, 10);
  ellipse(mouseX, mouseY, 1);
  
}
