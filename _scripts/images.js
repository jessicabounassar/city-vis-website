const sharp = require('sharp');
const fs = require('fs');

const path = '../_images';
const output_full = '../src/site/assets/img/project_images';
const output_thumb = '../src/site/assets/img/collection_thumbs';
const files = fs.readdirSync(path);

(async () => {
for (let f = 0; f < files.length; f += 1) {
  // thumbnail
  await sharp(path + '/' + files[f])
    .resize({
      width: 300,
      height: 175,
      fit: 'cover'
    })
    .jpeg({
      quality: 65
    })
    .toFile(output_thumb + '/' + files[f].split('.')[0] + '.jpg');

  // full
  await sharp(path + '/' + files[f])
    .resize({
      width: 1200,
      height: 800,
      fit: 'inside', // contain
      background: {r:255, g: 255, b: 255, alpha: 1}
    })
    .jpeg({
      quality: 65
    })
    .toFile(output_full + '/' + files[f].split('.')[0] + '.jpg');

  console.log(files.length, f);
}
})();