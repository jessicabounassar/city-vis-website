const fs = require('fs');
const fastCsv = require('fast-csv');
const taxonomies = require('../src/site/_data/taxonomies.json');
const CSV_STRING = fs.readFileSync('../_newImages/data.csv', 'utf8');
const csv = [];

const getID = (type, value) => {
  let idMatch = null;
  let lastID = 0;
  taxonomies[type].taxonomies.forEach((t, ti) => {
    if (t.key === value.trim()) {
      idMatch = t.id;
      taxonomies[type].taxonomies[ti].count += 1;
    }
    if (t.id > lastID) {
      lastID = t.id;
    }
  });
  if (idMatch === null) {
    taxonomies[type].other.forEach((t, ti) => {
      if (t.key === value.trim()) {
        idMatch = t.id;
        taxonomies[type].other[ti].count += 1;
      }
      if (t.id > lastID) {
        lastID = t.id;
      }
    });
  }
  if (idMatch === null) {
    taxonomies[type].other.push({
      "key": value.trim(),
      "id": lastID + 1,
      "count": 1
    });
    idMatch = lastID + 1;
  }
  return idMatch;
};

const stream = fastCsv.parse({ headers: true })
  .on('error', error => console.error(error))
  .on('data', row => csv.push(row))
  .on('end', () => {

    const projects = [];

    csv.forEach((c, ci) => {
      projects.push({
        "created": c["Submission Date"],
        "id": "2022" + c["Index"],
        "first_name": c["[Full name] First Name"],
        "last_name": c["[Full name] Last Name"],
        "organization": c["Organization"],
        "project_title": c["Full project title"],
        "project_year": c["Year of publication"],
        "project_description": c["Description"],
        "project_partner": c["Partner Organizations"],
        "winner": null,
        "types": c["What type describes your project best?"].split(' | ').map(n => getID("types", n)),
        "areas": c["What areas matches your project best?"].split(' | ').map(n => getID("areas", n)),
        "mediums": c["What medium describes your project best?"].split(' | ').map(n => getID("mediums", n)),
        "authors": c["Authors"].split('  ').map((a, ai) => {
          return {
            "name": a,
            "organization": "",
            "sort": ai
          }
        }),
        "imageNames": c["Images for the website"].split("  ").map(i => i.split('/')[5] + '.jpg'),
        "links": c["Project URLs"].split('  ').map(url => url.trim()),
        "short_title": c["Short title for web overview"]
      });
    });

    fs.writeFileSync('newProjects.json', JSON.stringify(projects), 'utf8');
    fs.writeFileSync('newTaxonomies.json', JSON.stringify(taxonomies), 'utf8');
  });

stream.write(CSV_STRING);
stream.end();
