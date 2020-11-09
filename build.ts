// remove old files, copy front end ones

import fs from 'fs-extra';
// import logger

try {
  // remove current build
  fs.removeSync('./dist/');
  // copy front end files
  // fs.copySync('./src/public', './dist/public');
  // fs.copySync('./src/views', './dist/views');
} catch (err) {
  console.log(err);
}
