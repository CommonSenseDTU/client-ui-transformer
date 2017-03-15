// @flow
"use strict";

import amqp from "amqplib/callback_api";
import winston from "winston";
import configureLogger from "./logger";
import compile from "./compile";

const rabbitMQ: string = process.env.RABBITMQ_SERVER || "localhost";
const spool: string = process.env.RESEARCHER_SPOOL || "/tmp";

type Message = {
  surveyId: string,
  stepId: string,
  path: string
};

configureLogger();

winston.level = "debug";

amqp.connect("amqp://" + rabbitMQ, function(error, connection) {
  connection.createChannel(function(error, channel) {
    var queue = "babel";

    channel.assertQueue(queue, { durable: true });
    winston.info("Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, function(msg) {
      winston.debug("Received %s", msg.content.toString());

      const message: Message = JSON.parse(msg.content.toString());
      const path: string = spool + message.path;
      winston.debug("Compiling:", path);

      compile(path);

    }, {noAck: true});
  });
});
