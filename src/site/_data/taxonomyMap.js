const fs = require('fs');

module.exports = () => {
  const taxonomies = JSON.parse(fs.readFileSync('./src/site/_data/taxonomies.json', 'utf-8'));
  Object.keys(taxonomies).forEach(key => {
    const map = {};
    taxonomies[key].taxonomies.forEach((t, ti) => {
      map[t.id] = { id: ti, group: 'taxonomies' };
    });
    taxonomies[key].other.forEach((t, ti) => {
      map[t.id] = { id: ti, group: 'other' };
    });
    taxonomies[key].map = map;
  });

  return taxonomies;
};