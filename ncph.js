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
  for (i = arr.length - 1; i > 0; i--) {
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
  this.state = seed;
  this.advance(); this.advance(); this.advance();
}
Lcg32.prototype.advance = function() {
  this.state = (this.state * 1664525 + 1013904223) % 0xFFFFFFFF;
};
Lcg32.prototype.gen = function() {
  this.advance();
  return this.state / 0xFFFFFFFF;
};

var clips = [
  'wicker-notthebees',
  'zandalee-inevitable',
  'firebirds-kiss',
  'driveangry-disrobe',
  'therock-gottago',
];

var clipDuration = 5000;

// Get the clip for a given Unix timestamp (deterministic).
//
// This works breaking the timestamp into blocks (the number of full sequences
// since Epoch) and index. The block is used as a seed to generate permutations.
function getClip(ts) {
  var total = Math.floor(ts / clipDuration);
  var block = Math.floor(total / clips.length);
  var index = total % clips.length;
  var permuted = shuffle(clips, new Lcg32(block));
  return permuted[index];
}

var vid = document.getElementById('vid');
var vidCounter = 0;

function changeVid() {
  vid.src = 'clips/' + getClip(Date.now()) + '.mp4';
  vid.play();
  ++vidCounter;
}

window.onload = function() {
  window.setInterval(changeVid, clipDuration);
  changeVid();
};
