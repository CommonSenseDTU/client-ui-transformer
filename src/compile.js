// @flow
"use strict";

import browserify from "browserify";
import fs from "fs";
import winston from "winston";

function compile(filename: string) {
  var outputName: string = filename.replace(".flow.js", ".browserify.js");
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

    const compiler = browserify(filename, { transform: "babelify" });
    compiler.bundle().pipe(outputStream);
  });
}

export default compile;
