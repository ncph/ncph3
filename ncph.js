// Copyright (C) 2016 ncph Authors
// This file is free software: You can redistribute it and/or modify it under
// the terms of the GNU AGPLv3 or later. See COPYING for details.

// Implementation of the Fischer-Yates-Durstenfeld O(n) shuffle algorithm. This
// variant is non-destructive (does not modify the input array), and takes the
// random number generator as a parameter, for deterministic operation.
//
//   https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
//
function shuffle(orig, rng) {
  arr = orig.slice(0);
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(rng.gen() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

// Implementation of a simple linear congruential generator, using the
// parameters from Teukolsky-Vetterling-Flannery's Numerical Recipes.
//
//   https://en.wikipedia.org/wiki/Linear_congruential_generator
//
function Lcg32(seed) {
  this.state = (seed + 0xad2158e3) % 0x100000000;
  this.advance(); this.advance(); this.advance(); this.advance();
}
Lcg32.prototype.advance = function() {
  this.state = (this.state * 1664525 + 1013904223) % 0x100000000;
};
Lcg32.prototype.gen = function() {
  this.advance();
  return this.state / 0x100000000;
};

var vid = document.getElementById('vid');
var vidCounter = 0;
var clipDuration = 5000;

function Clip(name) {
  this.name = name;
}
Clip.prototype.path = function() {
  return 'clips/' + this.name + '.mp4';
};
Clip.prototype.play = function() {
  if (this.cached !== undefined) {
    vid.src = this.cached;
  } else {
    vid.src = this.path();
  }
  vid.play();
  ++vidCounter;
};
Clip.prototype.preload = function() {
  if (this.cached === undefined) {
    var req = new XMLHttpRequest();
    req.open('GET', this.path(), true);
    req.responseType = 'blob';
    req.onload = function() {
      if (this.status === 200) {
        this.cached = URL.createObjectURL(this.response);
      }
    };
    req.send();
  }
};

var clips = [
  new Clip('wicker-notthebees'),
  new Clip('zandalee-inevitable'),
  new Clip('firebirds-kiss'),
  new Clip('therock-gottago'),
  new Clip('driveangry-disrobe'),
  new Clip('faceoff-hallelujah'),
  new Clip('wildheart-sing'),
  new Clip('corelli-sing'),
  new Clip('leavinglas-meet'),
  new Clip('gone60s-letsride'),
  new Clip('8mm-becausehecould'),
  new Clip('adaptation-narcissistic'),
];

// Get the permutation of clips for a given run.
//
// This computes a sequence such that the clips are always played in an order
// that appears random to humans, which very rarely should show a clip more than
// once in a single sitting.
//
// The sequence is first permuted using the runblock (blocks of 100 runs) as the
// seed, then split into groups of 6, and each group is permuted again using
// the run as the seed.
//
// By maintaing distinct groups within a runblock, seeing the same clip twice in
// a single sitting is only possible when straddling runblocks. Permuting groups
// as well adds variation between sequential runs. Within a runblock, the
// minimum spacing between two screenings of the same clip is N-6, where N is
// the total number of clips.
//
function getSequence(run) {
  var runBlock = Math.floor(run / 100);
  var permuted = shuffle(clips, new Lcg32(runBlock));

  var rng2 = new Lcg32(run);
  var permuted2 = [];
  for (var i = 0; i < permuted.length; i += 6) {
    var group = permuted.slice(i, i + 6);
    var shuffled = shuffle(group, rng2);
    permuted2 = permuted2.concat(shuffled);
  }
  return permuted2;
}

// Get the current clip from a timestamp.
function getClip(ts) {
  var total = Math.floor(ts / clipDuration);
  var run = Math.floor(total / clips.length);
  var clip = total % clips.length;
  var seq = getSequence(run);
  return seq[clip];
}

// Scheduler to be run every clipDuration milliseconds.
function scheduleVid(state) {
  var nextTimestamp = state.timestamp + clipDuration;
  getClip(state.timestamp).play();
  getClip(nextTimestamp).preload();
  state.timestamp = nextTimestamp;
}

// Run this event at startup.
window.onload = function() {
  // Wrapped in an object to pass by reference between invocations.
  var state = {timestamp: Date.now()};
  window.setInterval(scheduleVid, clipDuration, state);
  scheduleVid(state);
};

// Register keyboard event handler.
window.addEventListener('keydown', function(event) {
  switch (event.key) {
  case 'ArrowDown':
    vid.volume = Math.max(0.0, vid.volume - 0.05);
    break;
  case 'ArrowUp':
    vid.volume = Math.min(1.0, vid.volume + 0.05);
    break;
  default:
    return;
  }
});
