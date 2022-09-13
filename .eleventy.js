
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginTOC = require('eleventy-plugin-toc');

const moment = require('moment');

module.exports = function(config) {

  // A useful way to reference the context we are runing eleventy in
  let env = process.env.ELEVENTY_ENV;

  // Layout aliases can make templates more portable
  config.addLayoutAlias('default', 'layouts/base.njk');
  config.addLayoutAlias('workshop', 'layouts/workshop.njk');
  config.addLayoutAlias('home', 'layouts/home.njk');
  config.addLayoutAlias('static', 'layouts/static.njk');
  config.addLayoutAlias('project', 'layouts/project.njk');
  config.addLayoutAlias('exhibition', 'layouts/exhibition.njk');
  config.addLayoutAlias('collection', 'layouts/collection.njk');

  // add support for syntax highlighting
  config.addPlugin(syntaxHighlight);

  // add navigation data object
  config.addPlugin(eleventyNavigationPlugin);

  config.addPlugin(pluginTOC, {
    tags: ['h2'],
    wrapper: '',
    ul: true
  });

  config.addFilter("pageNav", function(navigation, page, locale) {
    const pageNav = {
      back: null,
      next: null
    };

    let foundPage = false;

    const check = (entry) => {
      if (entry.url !== page.url && !foundPage) {
        pageNav.back = entry;
      }
      if (foundPage && pageNav.next === null) {
        pageNav.next = entry;
      }
      if (entry.url === page.url) {
        foundPage = true;
      }
    };

    navigation.forEach(nav => {
      if (nav.key === locale){
        nav.children.forEach(child => {
          check(child);
          child.children.forEach(entry => {
            check(entry);
          });
        });
      }
    });

    return pageNav;
  });

  // compress and combine js files
  config.addFilter("jsmin", function(code) {
    const UglifyJS = require("uglify-js");
    let minified = UglifyJS.minify(code);
      if( minified.error ) {
          console.log("UglifyJS error: ", minified.error);
          return code;
      }
      return minified.code;
  });

  config.addNunjucksFilter("date", function (date, format, locale) {
    locale = locale ? locale : "en";
    moment.locale(locale);
    return moment(date).format(format);
  });

  // pass some assets right through
  config.addPassthroughCopy("./src/site/assets");
  config.addPassthroughCopy({"./src/site/_includes/roots" : "."});

  // make the seed target act like prod
  env = (env=="seed") ? "prod" : env;
  return {
    dir: {
      input: "src/site",
      output: "dist"
    },
    templateFormats : ["njk", "md", "11ty.js"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true
  };

};