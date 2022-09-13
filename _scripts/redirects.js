// this script generates the redirects from the former page structure to the new

let redirects = '';

// a few static redirects
const statics = [
  ['about.php', '/about'],
  ['competition.php?year=2016', '/competitions/2016'],
  ['competition.php?year=2018', '/competitions/2018'],
  ['competition.php', '/competitions/2022'],
  ['contact.php', '/contact'],
  ['contribute.php', '/competitions/2022'],
  ['exhibition.php?year=2018', '/exhibitions/2018'],
  ['exhibition.php', '/exhibitions/2022'],
  ['index.php', '/'],
  ['legal.php', '/legal'],
  ['press.php', '/press'],
  ['privacy.php', '/legal'],
  ['workshops-2018.php', '/workshops/2018'],
  ['workshop-2019.php', '/workshops/2019'],
  ['workshop-2020.php', '/workshops/2020'],
  ['workshop.php', '/workshops/2022'],
];

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('../src/site/_data/projects.json', 'utf8'));

const slugify = require('slugify')

data.forEach(d => statics.push([
  'project.php id=' + d.id,
  '/collection/project/' + slugify(d.short_title, { lower: true, strict: true })
]));

statics.push(['project.php', '/collection']);

statics.forEach((d, i) => {
  if (i > 0) {
    redirects += '\n';
  }
  redirects += '/' + d[0] + '\t' + d[1];
});

fs.writeFileSync('../src/site/_includes/roots/_redirects', redirects, 'utf8');