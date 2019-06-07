/**
 *  Fetch npm pkg meta-data and save it locally for the future (integrations)
 * 
 *  Usage:
 *  
 *  Author: Ido
 *  Update: June 2019
 *  
 * See: 
 * https://www.npmjs.com/package/libnpmsearch
 * 
 * 
 */
const search = require("libnpmsearch");
const mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: "8889",
  database: "npm_pkgs"
});

//
//
//
function dbConnectionUnitTest() {
  con.connect(function(err) {
    if (err) throw err;
    console.log("⛑ Connected to mysql");
    var sql = "INSERT INTO pkgs (pkgName, pkgDesc) VALUES ('momo', 'Highway 37 is the desc')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("👑 1 record inserted");
    });
  });  
}

//
//
//
function mysql_real_escape_string (str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
          case "\0":
              return "\\0";
          case "\x08":
              return "\\b";
          case "\x09":
              return "\\t";
          case "\x1a":
              return "\\z";
          case "\n":
              return "\\n";
          case "\r":
              return "\\r";
          case "\"":
          case "'":
          case "\\":
          case "%":
              return "\\"+char; // prepends a backslash to backslash, percent,
                                // and double/single quotes
      }
  });
}

//
//
//
async function saveRecord(repoData) {
    console.log("saveRecord() ⛑ Connected to mysql");
    let name = repoData.name;
    let desc = mysql_real_escape_string(repoData.description);
    let version = repoData.version;
    let codeRepoUrl = repoData.links.repository;
    let npmPkgUrl = repoData.links.npm;
    let keywords = "";
    if (repoData.keywords) {
      keywords = repoData.keywords.toString();
    }
    //console.log(i + ") Name: " + name + " , desc: " + desc + " , version:" + version + " , tags: " + keywords);  
    let checkIfExistSQL = "SELECT pkgId, pkgName from pkgs WHERE pkgName = '" + name + "'";
    con.query(checkIfExistSQL, function (err, result) {
      if (err) {
        console.log("ERROR with checking for pkgName: " + name + " ERR:" +err);
      }
      else {
        let sql = "";
        if (result && result.length == 1) {
            // update the existing one
            sql = "UPDATE pkgs SET pkgName = '" + name + "' , pkgDesc = '" + desc +  "' , pkgVersion= '" + version + "' , keywords = '" +
            keywords + "' , repoUrl = '" + npmPkgUrl + "' ,codeUrl =  '" + codeRepoUrl + "' , comments = 'Updated: " + new Date() + "' " +
            " WHERE pkgId = " + result[0].pkgId;
        }
        else {
          // new one
          sql = "INSERT INTO pkgs (pkgName, pkgDesc, pkgVersion, keywords, repoUrl, codeUrl, comments) VALUES (" + 
            "'" + name + "' , " + 
            "'" + desc + "' , " + 
            "'" + version + "' , " + 
            "'" + keywords + "' , " + 
            "'" + npmPkgUrl + "' , " + 
            "'" + codeRepoUrl + "' ," + 
            "'Inserted: " + new Date() + "'" + ")";
        }
        console.log("** SQL: " + sql);

          con.query(sql, function (err, result) {
            if (err) {
              console.log("Opps... on res: " + result + " | Err: "+ err);
            }
            else {
              console.log("saveRecord() 👑 1 record inserted. Res.affectedRows: " + result.affectedRows);
            }
            
          });
      }
      console.log("saveRecord() 👑 1 record inserted");
    });
    
}

//
//
//
async function fetchAndSave(keyword) {
  let pkgMetaData = await search(keyword);
  console.log(" 🐼 We got " + pkgMetaData.length + " packages for: " + keyword);
  let i = 1;
    pkgMetaData.forEach(repoData => {
      try {
        saveRecord(repoData);  
      } catch (error) {
        console.log("--- we have an issue with: " + repoData.name);
        console.log(error); 
      }
    });
  // });
}

//
// Start the party
//

const topPkg = ["lodash","request","chalk","react","express","commander","moment","debug","async","prop-types","react-dom","bluebird","fs-extra","tslib","axios",
"underscore","uuid","mkdirp","classnames","vue","body-parser","glob","yargs","webpack","rxjs","colors","babel-runtime","inquirer","jquery","minimist","babel-core",
"aws-sdk","yeoman-generator","core-js","through2","dotenv","redux","babel-loader","semver","winston","q","cheerio","typescript","eslint","rimraf","css-loader","@types/node",
"@angular/core","react-redux","shelljs","style-loader","js-yaml","@angular/common","zone.js","node-fetch","babel-eslint","ramda","gulp","object-assign","file-loader","babel-polyfill",
"@angular/platform-browser","request-promise","babel-preset-es2015","mongoose","@angular/compiler","gulp-util","handlebars","eslint-plugin-import","@babel/runtime","mocha","mongodb",
"lodash","request","chalk","react","express","commander","moment","debug","async","prop-types","react-dom","bluebird","fs-extra","tslib","axios","underscore","uuid","mkdirp","classnames",
"vue","body-parser","glob","yargs","webpack","rxjs","colors","babel-runtime","inquirer","jquery","minimist","babel-core","aws-sdk","yeoman-generator","core-js","through2","dotenv","redux",
"babel-loader","semver","winston","q","cheerio","typescript","eslint","rimraf","css-loader","@types/node","@angular/core","react-redux","shelljs","style-loader","js-yaml","@angular/common",
"zone.js","node-fetch","babel-eslint","ramda","gulp","object-assign","file-loader","babel-polyfill","@angular/platform-browser","request-promise","babel-preset-es2015","mongoose","@angular/compiler",
"gulp-util","handlebars","eslint-plugin-import","@babel/runtime","mocha","mongodb","@angular/forms","eslint-plugin-react","@angular/platform-browser-dynamic","superagent","url-loader",
"@angular/http","jsonwebtoken","webpack-dev-server","joi","@angular/router","node-sass","socket.io","redis","html-webpack-plugin","ora","immutable","postcss-loader","chai","ws","yosay","ejs",
"ember-cli-babel","autoprefixer","xml2js","bootstrap","coffee-script","morgan","styled-components","path","@babel/core","react-router-dom","cookie-parser","reflect-metadata","jest","sass-loader"];

(async () => {
  try {
    con.connect(function(err) {
      if (err) throw err;
      
      topPkg.forEach(pkg => {
        fetchAndSave(pkg);
      });    
    });

    
  } catch (error) {
      console.log(error.response.body);
  }
})();

// unit test: fetchAndSave("openssl");
