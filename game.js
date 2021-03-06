/*
Created by Michael Delfino for Global Game Jam 2017
Libraries: p5.js and p5.sound.js
Sound effects made in Bfxr
Background music made in Soundation Studio
*/

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
var timer = 0;
var show_instructions = true;
var boss = new Boss;
var evil_awakened = false;

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
  if (wave % 10 == 0) {
    enemies_remaining /= 10;
    boss.reset();
  }
}

function reset() {
  player = new Player();
  boss.die();
  player.setup();
  wave = 0;
  enemies_remaining = 0;
  enemies = [];
  enemy_projectiles = [];
  powerups = [];
  display_wave = false;
  game_over = false;
  timer = 0;
  show_instructions = true;
}

var carrier; // this is the oscillator we will hear
var modulator; // this oscillator will modulate the frequency of the carrier

var analyzer; // we'll use this visualize the waveform

// the carrier frequency pre-modulation
var carrierBaseFreq = 220;

// min/max ranges for modulator
var modMaxFreq = 10;
var modMinFreq = 0;
var modMaxDepth = -50;
var modMinDepth = -150;

function preload() {
  player_explosion = loadSound('assets/player_explosion.wav');
  player_hit = loadSound('assets/player_hit.wav');
  enemy_explosion = loadSound('assets/enemy_explosion.wav');
  bg_music = loadSound('assets/bg_music.wav');
}

function setup() {
  var cnv = createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  player.setup();

  carrier = new p5.Oscillator('sine');
  carrier.amp(0); // set amplitude
  carrier.freq(carrierBaseFreq); // set frequency
  carrier.start(); // start oscillating

  // try changing the type to 'square', 'sine' or 'triangle'
  modulator = new p5.Oscillator('triangle');
  modulator.start();

  // add the modulator's output to modulate the carrier's frequency
  modulator.disconnect();
  carrier.freq( modulator );

  // create an FFT to analyze the audio
  analyzer = new p5.FFT();

  // fade carrier in/out on mouseover / touch start
  toggleAudio(cnv);

  bg_music.loop();

  window.onblur = function() {
    bg_music.pause();
  };

  window.onfocus = function() {
    bg_music.loop();
  };
}

function draw() {
 
  timer++;
  background(40 + 20 * Math.sin(timer * Math.PI / 90));

  // map mouseY to modulator freq between a maximum and minimum frequency
  var modFreq = map(mouseY, height, 0, modMinFreq, modMaxFreq);
  modulator.freq(modFreq);

  // change the amplitude of the modulator
  // negative amp reverses the sawtooth waveform, and sounds percussive
  var modDepth = map(mouseX, 0, width, modMinDepth, modMaxDepth);
  modulator.amp(modDepth);

  // analyze the waveform
  waveform = analyzer.waveform();

  // draw the shape of the waveform
  stroke(255);
  strokeWeight(5);
  beginShape();
  for (var i = 0; i < waveform.length; i++){
    var x = map(i, 0, waveform.length, 0, width);
    var y = map(waveform[i], -1, 1, 1, 50);
    vertex(x, y + 40);
  }
  endShape();

  if (show_instructions) {
    stroke(180);
    fill(180, 0, 0);
    textSize(32);
    textAlign(CENTER);
    strokeWeight(2);
    if (evil_awakened) {
      text("EVIL HAS AWAKENED", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4);  
    } else {
      text("WASD Keys to Move\nMouse to Aim/Shoot", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4);  
    }
    if (timer > 500) {
      show_instructions = false;
      evil_awakened = false;
    }
  }

  if (player.score >= 666 && !evil_awakened) {
    boss.reset();
    evil_awakened = true;
  }

  if (enemies_remaining <= 0 && enemies.length == 0 && !display_wave && !boss.alive) {
    wave++;
    display_wave = true;
    setTimeout(startWave, 3000);
  }

  if (game_over) {
    stroke(180, 0, 0);
    fill(180, 0, 0);
    textSize(64);
    textAlign(CENTER);
    strokeWeight(1 + 20 * Math.sin(timer * Math.PI / 90));
    text("YOU DEAD", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2); 
  } else if (display_wave) {
    stroke(180);
    fill(180);
    textSize(64);
    textAlign(CENTER);
    strokeWeight(1 + 20 * Math.sin(timer * Math.PI / 90));
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
      enemy_explosion.setVolume(0.2);
      enemy_explosion.play();
    } else if (collides(enemies[i], player)) {
      player_hit.setVolume(0.3);
      player_hit.play();
      player.hit();
      enemies.splice(i, 1);
      enemy_explosion.setVolume(0.2);
      enemy_explosion.play();
    } else {
      if (boss.alive) {
        if (enemies[i].x < boss.x) {
          enemies[i].x += .5;
        }
        if (enemies[i].x > boss.x) {
          enemies[i].x -= .5;
        }
        if (enemies[i].y < boss.y) {
          enemies[i].y += .5;
        }
        if (enemies[i].y > boss.y) {
          enemies[i].y -= .5;
        }
      }
      if (Math.random() * 200 < enemies[i].fire_rate) {
        enemies[i].shoot(enemy_projectiles);
      }
      if (Math.abs(enemies[i].x - boss.x) < 1 && Math.abs(enemies[i].y - boss.y) < 1) {
        enemies.splice(i, 1);
        boss.radialShoot(36);
        boss.addOrbiter();
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
      player_hit.setVolume(0.3);
      player_hit.play();
      player.hit(); 
      enemy_projectiles.splice(i, 1);
    } else {
      enemy_projectiles[i].x += proj.x_speed;
      enemy_projectiles[i].y += proj.y_speed;
    }
  }

  if (!player.alive && !game_over) {
    player_explosion.setVolume(0.5);
    player_explosion.play();
    game_over = true;
    setTimeout(reset, 3000);
  }

  for (var i=powerups.length-1; i>=0; --i){
    powerups[i].update();
    powerups[i].draw();
    if (collides(powerups[i], {x: player.x, y: player.y, size: player.size + player.pickupradius})) {
      powerups[i].alive = false;
      player.addOrbiter();
      player.powerup(powerups[i].type);
    }
    if (!powerups[i].alive) {
      powerups.splice(i, 1);
    }
  }

  if (!game_over) {
    player.update();
    player.draw();
  }

  if (boss.alive) {
    boss.update();
    boss.draw();
    if (Math.random() * 500 < spawn_chance) {
      powerups.push(new Powerup({x: Math.random() * SCREEN_WIDTH, y: Math.random() * SCREEN_HEIGHT}));
    }
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
    if (boss.alive && boss.intro_over) {
      for (var j=0; j<boss.orbiters.length; ++j) {
        if (collides(proj, boss.orbiters[j])) {
          player.projectiles.splice(i, 1);
          boss.orbiters[j].hp--;
          enemy_explosion.play();
        }
      }
      if (boss.last_resort && collides(proj, boss)) {
        boss.hp--;
        player.projectiles.splice(i, 1);
        boss.radialShoot(36);
        enemy_explosion.play();
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

// helper function to toggle sound
function toggleAudio(cnv) {
  cnv.mouseOver(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.touchStarted(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.mouseOut(function() {
    carrier.amp(0.0, 1.0);
  });
}

function degToRadians(angle) {
  return angle * Math.PI / 180;
}

function fluctuate(mean, variance, spd) {
  return mean - variance + 2 * variance * Math.sin(timer * spd * Math.PI / 180);
}
