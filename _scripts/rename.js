const fs = require('fs');

const path = 'PATH';
const target = '../_tmpImages';

const accepted = [
  'jpg', 'jpeg',
  'png',
  'jpg'
];

const dict = {};

const files = fs.readdirSync(path);
files.forEach(f => {
  const ext = f.toLowerCase().split('.').slice(-1)[0];
  if (accepted.includes(ext)) {
    const id = f.substring(11,16);
    if (!(id in dict)) {
      dict[id] = 1;
    }
    const name = id + '_' + dict[id] + '.' + ext;
    fs.copyFileSync(path + '/' + f, target + '/' + name);
    dict[id]++;
  }
});

console.log(dict);
