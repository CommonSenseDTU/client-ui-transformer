// @flow
"use scrict";

import winston from "winston";

function configureLogger() {
  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {
    timestamp: function() {
      return (new Date()).toJSON();
    },
    formatter: function(options) {
      // Return string will be passed to logger.
      return options.timestamp() + ' [' + options.level.toUpperCase() + '] ' +
        (options.message ? options.message : '') +
        (options.meta && Object.keys(options.meta).length ? '\n\t'+
        JSON.stringify(options.meta) : '' );
    }
  });
}

export default configureLogger;
