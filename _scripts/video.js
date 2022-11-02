const fs = require('fs');
const data = JSON.parse(fs.readFileSync('../src/site/_data/projects.json', 'utf8'));
const html = fs.readFileSync('snap.html', 'utf-8');
const puppeteer = require("puppeteer");
puppeteer
  .launch({
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  })
  .then(async (browser) => {
    const page = await browser.newPage();
    for (let di = 0; di < data.length; di++) {
      const d = data[di];
      for (let ii = 0; ii < d.imageNames.length; ii++) {
        console.log(di, ii);
        const i = d.imageNames[ii];
        const bitmap = fs.readFileSync('../src/site/assets/img/project_images/' + i.split('.')[0] + '@2x.jpg');
        const base64 = Buffer.from(bitmap).toString('base64');
        let h = html;
        h = h.replace('$$$IMAGE$$$', 'data:image/jpg;base64,' + base64);
        h = h.replace('$$$TITLE$$$', d.project_title);
        h = h.replace('$$$YEAR$$$', d.project_year);
        h = h.replace('$$$AUTHORS$$$', d.authors.map(a => {
          const s = a.name.split(',');
          if (s.length > 1) { 
            return s[1].trim() + ' ' + s[0].trim();
          }
          return a.name.trim();
        }).join(', '));
        await page.setContent(h);
        await page.screenshot({ path: `../_videoFrames/${di}_${ii}.png` });
      }
    }
    await page.close();
    await browser.close();
  });