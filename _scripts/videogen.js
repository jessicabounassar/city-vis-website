const videoshow = require('videoshow');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('../src/site/_data/projects.json', 'utf8'));

const images = [];

let inBetween = 0;
const limit = 100;
const offset =146;

data.forEach((d, dd) => {
  if (images.length < limit && dd >= offset) {
    console.log(dd);
    if (d.imageNames.length > 0) {
      d.imageNames.forEach((i, ii) => {
        images.push({
          path: `../_videoFrames/${dd}_${ii}.png`,
          loop: Math.max([3, (6 / d.imageNames.length)])
        });
      });
    }
    inBetween++;
    if (inBetween > 10) {
      inBetween = 0;
      images.push({
        path: `cityvis.png`,
        loop: 5
      });
    }
  }
});

if (images.length === 0) {
  console.log('FINISHED');
  process.exit();
}
videoshow(images, {
  size: '1920x1080',
  transition: false
})
.save('video_' + offset + '.mp4')
.on('start', (c) => {
  console.log('start:', c);
})
.on('error', (err, stdout, stderr) => {
  console.error('Error:', err)
  console.error('ffmpeg stderr:', stderr)
})
.on('end', () => {
  console.log('DONE');
  process.exit();
});