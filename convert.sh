#!/bin/sh

# Copyright (C) 2016 ncph Authors
# This file is free software: You can redistribute it and/or modify it under the
# terms of the GNU AGPLv3 or later. See COPYING for details.

# Convert any video to a large file with near-lossless compression. These are
# kept separately to allow changing the final streaming quality without touching
# the original videos too much.
cageconvert() {
    if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] ; then
	echo "Usage: cageconvert INFILE OUTFILE HH:MM:SS" >&2
	return
    fi

    ffmpeg -i "$1" -ss "$3" -t 60.5 -c:v h264 -tune film -crf 15 -c:a mp3 -b:a 320k -ac 2 "$2"
}

# Convert the intermediate near-lossless file to final form.
cagedownconvert() {
    if [ -z "$1" ] || [ -z "$2" ] ; then
	echo "Usage: cagedownconvert INFILE OUTFILE" >&2
	return
    fi

    ffmpeg -i "$1" -c:v h264 -tune film -preset slow -profile:v baseline -level 3.1 -vf scale=-2:480 -pix_fmt yuv420p -minrate 740k -maxrate 960k -c:a mp3 -b:a 128k -ar 44100 "$2"
}
