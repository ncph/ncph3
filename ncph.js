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
  this.state = (this.state * 1664525 + 1013904223) % 0x100000000;
};
Lcg32.prototype.gen = function() {
  this.advance();
  return this.state / 0x100000000;
};

var clips = [
  'wicker-notthebees',
  'zandalee-inevitable',
  'firebirds-kiss',
  'therock-gottago',
  'driveangry-disrobe',
  'faceoff-hallelujah',
  'wildheart-sing',
  'corelli-sing',
  'leavinglas-meet',
  'gone60s-letsride',
  '8mm-becausehecould',
  'adaptation-narcissistic',
];

var clipDuration = 5000;

// Get the permutation of clips for a given run.
//
// This computes a sequence such that the clips are always played in
// random-seeming order, and very rarely more than once in any given N/2
// sequence.
//
// The sequence is first permuted using the runblock (blocks of 100 runs) as the
// seed, then split into two equal sized groups, and each group is permuted
// again using the run as the seed. By splitting into two groups, seeing the
// same clip twice is only possible at runblock boundaries.
//
function getSequence() {
  var runBlock = run * 500;
  var rng1 = new Lcg32(runBlock);
  var permuted1 = shuffle(clips, rng1);

  var rng2 = new Lcg32(run);
  var mid = Math.floor(permuted1.length / 2);
  var top = shuffle(permuted1.slice(0, mid), rng2);
  var bot = shuffle(permuted1.slice(mid), rng2);
  var permuted2 = top.concat(bot);

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
