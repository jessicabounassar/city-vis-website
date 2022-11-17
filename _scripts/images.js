const sharp = require('sharp');
const fs = require('fs');
const newProjects = require('./newProjects.json');

const validImages = [];
newProjects.forEach(p => {
  p.imageNames.forEach(i => {
    validImages.push(i.split('.')[0]);
  });
});

const path = '../_newImages';
const output_full = '../src/site/assets/img/project_images';
const output_thumb = '../src/site/assets/img/collection_thumbs';
const files = fs.readdirSync(path)
  .filter(f => f.indexOf('.csv') === -1)
  .filter(f => validImages.includes(f.split('.')[0]));

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
      quality: 90
    })
    .toFile(output_thumb + '/' + files[f].split('.')[0] + '.jpg');
  
  await sharp(path + '/' + files[f])
    .resize({
      width: 600,
      height: 350,
      fit: 'cover'
    })
    .jpeg({
      quality: 90
    })
    .toFile(output_thumb + '/' + files[f].split('.')[0] + '@2x.jpg');

  // full
  await sharp(path + '/' + files[f])
    .resize({
      width: 1200,
      height: 800,
      fit: 'inside', // contain
      background: {r:255, g: 255, b: 255, alpha: 1}
    })
    .jpeg({
      quality: 90
    })
    .toFile(output_full + '/' + files[f].split('.')[0] + '.jpg');
  
  await sharp(path + '/' + files[f])
    .resize({
      width: 2400,
      height: 1600,
      fit: 'inside', // contain
      background: {r:255, g: 255, b: 255, alpha: 1}
    })
    .jpeg({
      quality: 90
    })
    .toFile(output_full + '/' + files[f].split('.')[0] + '@2x.jpg');

  console.log(files.length, f);
}
})();