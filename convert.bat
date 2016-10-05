REM Usage: convert.bat <infile> <outfile> <timestamp>
ffmpeg -i %1 -ss %3 -t 60.5 -c:v h264 -tune film -crf 15 -c:a mp3 -b:a 320k -ac 2 %2
