const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 900;

const W_KEY = 87;
const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;

var player = new Player();
var enemies = [];
var enemy_projectiles = [];
var spawn_chance = 5;

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
  player.setup();
}

function draw() {
 
  //draw blue background
  background(40, 40, 200);

  if (Math.random() * 100 < spawn_chance && enemies.length < 100) {
    enemies.push(new Enemy('standard'));
  }

  for (var i=enemies.length-1; i>=0; --i) {
    enemies[i].update();
    enemies[i].draw();
    if (!enemies[i].alive) {
      enemies.splice(i, 1);
    }
  }

  player.update();
  player.draw();
 
  
  for (var i = player.projectiles.length - 1; i >= 0; --i) {
    proj = player.projectiles[i];
    fill(Math.random()*255, Math.random()*255, Math.random()*255);
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
  stroke(180);
  strokeWeight(2);
  noFill();
  ellipse(mouseX, mouseY, 10);
  line(mouseX, mouseY - 8, mouseX, mouseY + 8);
  line(mouseX - 8, mouseY, mouseX + 8, mouseY);
}
