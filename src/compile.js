// @flow
"use strict";

import browserify from "browserify";
import fs from "fs";
import path from "path";
import winston from "winston";

function compile(filename: string) {
  var outputName: string = filename.replace(".flow.js", ".browserify.js");
  const dirname: string = path.dirname(filename);
  if (!fs.existsSync(dirname + "/node_modules")) {
    fs.symlinkSync(process.cwd() + "/node_modules", dirname + "/node_modules", "dir");
  }

  fs.open(outputName, "w", 0o555, function (error, fd) {
    if (error) {
      winston.error("Error opening " + outputName + ":", error);
      return;
    }
    if (!fd) {
      winston.error("No file descriptor, bailing!");
      return;
    }
    const outputStream = fs.createWriteStream(outputName, { fd: fd });

    winston.debug("pwd:", process.cwd());
    const compiler = browserify(filename);
    compiler.transform("babelify", {
      "presets": ["es2015"],
      "plugins": [
        "babel-polyfill",
        "syntax-flow",
        "transform-flow-strip-types",
        "transform-async-to-generator"
      ]
    }).bundle().pipe(outputStream);
  });
}

export default compile;
