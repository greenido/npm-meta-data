/**
 *  Fetch npm most depended packages and save them in our DB
 * 
 *  Author: Ido
 *  Update: June 2019
 *  
 * See: 
 * 
   Use: view-source: https://www.npmjs.com/browse/depended?offset=36
 * https://www.npmjs.com/package/libnpmsearch
 * 
 * Result:
 * ["lodash","request","chalk","react","express","commander","moment","debug","async","prop-types","react-dom","bluebird","fs-extra","tslib","axios","underscore",
 * "uuid","mkdirp","classnames","vue","body-parser","glob","yargs","webpack","rxjs","colors","babel-runtime","inquirer","jquery","minimist","babel-core","aws-sdk",
 * "yeoman-generator","core-js","through2","dotenv","redux","babel-loader","semver","winston","q","cheerio","typescript","eslint","rimraf","css-loader","@types/node",
 * "@angular/core","react-redux","shelljs","style-loader","js-yaml","@angular/common","zone.js","node-fetch","babel-eslint","ramda","gulp","object-assign","file-loader",
 * "babel-polyfill","@angular/platform-browser","request-promise","babel-preset-es2015","mongoose","@angular/compiler","gulp-util","handlebars","eslint-plugin-import",
 * "@babel/runtime","mocha","mongodb","lodash","request","chalk","react","express","commander","moment","debug","async","prop-types","react-dom","bluebird","fs-extra","tslib","axios","underscore","uuid","mkdirp","classnames","vue","body-parser","glob","yargs","webpack","rxjs","colors","babel-runtime","inquirer","jquery","minimist","babel-core","aws-sdk","yeoman-generator","core-js","through2","dotenv","redux","babel-loader","semver","winston","q","cheerio","typescript","eslint","rimraf","css-loader","@types/node","@angular/core","react-redux","shelljs","style-loader","js-yaml","@angular/common","zone.js","node-fetch","babel-eslint","ramda","gulp","object-assign","file-loader","babel-polyfill","@angular/platform-browser","request-promise","babel-preset-es2015","mongoose","@angular/compiler","gulp-util","handlebars","eslint-plugin-import","@babel/runtime","mocha","mongodb","@angular/forms","eslint-plugin-react","@angular/platform-browser-dynamic","superagent","url-loader","@angular/http","jsonwebtoken","webpack-dev-server","joi","@angular/router","node-sass","socket.io","redis","html-webpack-plugin","ora","immutable","postcss-loader","chai","ws","yosay","ejs","ember-cli-babel","autoprefixer","xml2js","bootstrap","coffee-script","morgan","styled-components","path","@babel/core","react-router-dom","cookie-parser","reflect-metadata","jest","sass-loader"]
 * 
 * 
 *  TODO:
 *  check the list of pkg from: https://gist.github.com/anvaka/8e8fa57c7ee1350e3491
 */
const got = require('got');
const fs = require('fs');

//
//
//
async function fetchTopRepos(offset) {
    try {
        const response = await got('https://www.npmjs.com/browse/depended?offset=' + offset);
        console.log("☑️ Working on offset: "+ offset);
        let body = response.body;
        let inx1 = body.indexOf("window.__context__ =") + 21;
        let inx2 = body.indexOf("</script>", inx1 + 100);
        let dataJson = JSON.parse(body.substring(inx1, inx2));
        //console.log('DATA: ' + dataJson);
        let packages = dataJson.context.packages;
        let rowToFile = "";
        packages.forEach(pkg => {
          console.log("The pkg name: "+pkg.name);
          rowToFile += pkg.name + ",";
        });
        rowToFile += "\n";
        fs.appendFile("topPkgs.csv", rowToFile, function(err) {
          if(err) {
              return console.log(err);
          }
          //console.log("The file was saved!");
        }); 
        // console.log(response.body);
    } catch (error) {
        console.log(error);
    }
  }

  for (let j = 0; j < 100; j=j+36) {
    (async () => {
      try {
        await fetchTopRepos(j);
        
      } catch (error) {
        console.log(error.response.body);
      }
    })();
  }