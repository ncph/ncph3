// Copyright (C) 2016 ncph Authors
// This file is free software: You can redistribute it and/or modify it under
// the terms of the GNU AGPLv3 or later. See COPYING for details.

var films = [
  "/clips/johnwick-sm.mp4",
  "/clips/batman-sm.mp4",
  "/clips/captaineo-sm.mp4",
];

var vid = document.getElementById('vid');
var vidCounter = 0;

// Implementation of the Fischer-Yates-Durstenfeld O(n) shuffle algorithm
// which does not modify the input array, and takes a random number
// generator as a parameter for deterministic operation.
function shuffle(orig, rng) {
  arr = orig.slice(0);
  for (i = arr.length-1; i > 0; i--) {
    var j = Math.floor(rng() * (i+1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;

// Get the clip for a given Unix timestamp (deterministic).
//
// This works breaking the timestamp into blocks (the number of full sequences
// since Epoch) and index. The block is used as a deterministic seed to
// generate a permutation.
function getClip(ts) {
  var total = Math.floor(ts / 60000);
  var block = total % films.length;
  var index = total / films.length;

  var permuted = shuffle(films, deterRand);
  return permuted[index];
}

function playNextVid() {
  vid.pause();
  vid.currentSrc = "/clips/johnwick-sm.mp4";
  vid.currentTime = 0;
  vid.play();
  ++vidCounter;
}

window.onload = function() {
  window.setInterval(playNextVid, 10000);
  playNextVid();
};
