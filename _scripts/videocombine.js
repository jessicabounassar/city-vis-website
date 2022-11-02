var fluent_ffmpeg = require("fluent-ffmpeg");

var mergedVideo = fluent_ffmpeg();
var videoNames = [
  './video_0.mp4',
  './video_18.mp4',
  './video_41.mp4',
  './video_53.mp4',
  './video_77.mp4',
  './video_92.mp4',
  './video_110.mp4',
  './video_132.mp4'
];

videoNames.forEach(function(videoName){
    mergedVideo = mergedVideo.addInput(videoName);
});

// .size('1920x1080')

mergedVideo.noAudio().outputOption('-pix_fmt yuv420p').videoCodec('libx264').mergeToFile('./mergedVideo.mp4', './tmp/')
.on('error', function(err) {
    console.log('Error ' + err.message);
})
.on('end', function() {
    console.log('Finished!');
});