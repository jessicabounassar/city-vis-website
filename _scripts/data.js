const fs = require('fs');
const data = JSON.parse(fs.readFileSync('../src/site/_data/projects.json', 'utf8'));

const files = fs.readdirSync('../src/site/assets/img/collection_thumbs');
const dict = {};

files.forEach(f => {
  const id = f.split('_')[0];
  if (!(id in dict)) {
    dict[id] = 0;
  }
  dict[id]++;
});

data.forEach(d => {
  const imageNames = [];
  if (d.id in dict) {
    for (let i = 0; i < dict[d.id]; i += 1) {
      imageNames.push(d.id + '_' + (i + 1) + '.jpg');
    }
  }
  d.imageNames = imageNames;
});

fs.writeFileSync('projects.json', JSON.stringify(data), 'utf8');