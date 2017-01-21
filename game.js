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
var max_enemies = 100;
var wave = 0;
var enemies_remaining = 0;
var display_wave = false;
var powerups = [];
var game_over = false;

function distance(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.sqrt(dx*dx + dy*dy);
}

function collides(obj1, obj2) {
  var d = distance(obj1.x, obj1.y, obj2.x, obj2.y);
  return (obj1.size / 2 + obj2.size / 2 > d);
}

function startWave() {
  enemies_remaining = wave * 10;
  display_wave = false;
}

function reset() {
  player = new Player();
  player.setup();
  wave = 0;
  enemies_remaining = 0;
  enemies = [];
  enemy_projectiles = [];
  powerups = [];
  display_wave = false;
  game_over = false;
}

function setup() {
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  player.setup();
}

function draw() {
 
  //draw blue background
  background(40, 40, 200);

  if (enemies_remaining <= 0 && enemies.length == 0 && !display_wave) {
    wave++;
    display_wave = true;
    setTimeout(startWave, 2000);
  }

  if (game_over) {
    stroke(180, 0, 0);
    noFill();
    textSize(64);
    textAlign(CENTER);
    text("YOU DEAD", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2); 
  } else if (display_wave) {
    stroke(180);
    noFill();
    textSize(64);
    textAlign(CENTER);
    text("WAVE " + wave, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
  }

  if (Math.random() * 100 < spawn_chance && enemies.length < max_enemies && enemies_remaining > 0) {
    enemies.push(new Enemy('standard'));
    enemies_remaining--;
  }

  for (var i=enemies.length-1; i>=0; --i) {
    enemies[i].update();
    enemies[i].draw();
    if (!enemies[i].alive) {
      if (Math.random() * 100 < spawn_chance || enemies.length == 1 && enemies_remaining == 0) {
        powerups.push(new Powerup({x: enemies[i].x, y: enemies[i].y}));
      }     
      enemies.splice(i, 1);
    } else if (collides(enemies[i], player)) {
      player.hit();
      enemies.splice(i, 1);
    } else {
      if (Math.random() * 100 < enemies[i].fire_rate) {
        enemies[i].shoot(enemy_projectiles);
      }
    }
  }

  for (var i=enemy_projectiles.length-1; i>=0; --i) {
    proj = enemy_projectiles[i];
    noStroke();
    fill(55 + Math.random() * 200, 0, 0);
    ellipse(proj.x, proj.y, proj.size);
    if (proj.x > SCREEN_WIDTH || proj.x < 0 || proj.y > SCREEN_HEIGHT || proj.y < 0) {
      enemy_projectiles.splice(i, 1);
    } else if (collides(proj, player)) {
      player.hit(); 
      enemy_projectiles.splice(i, 1);
    } else {
      enemy_projectiles[i].x += proj.x_speed;
      enemy_projectiles[i].y += proj.y_speed;
    }
  }

  if (!player.alive && !game_over) {
    game_over = true;
    setTimeout(reset, 3000);
  }

  for (var i=powerups.length-1; i>=0; --i){
    powerups[i].update();
    powerups[i].draw();
    if (collides(powerups[i], {x: player.x, y: player.y, size: player.size + player.pickupradius})) {
      powerups[i].alive = false;
      player.addOrbiter();
    }
    if (!powerups[i].alive) {
      powerups.splice(i, 1);
    }
  }

  if (!game_over) {
    player.update();
    player.draw();
  }
  
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
        player.score++;
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
