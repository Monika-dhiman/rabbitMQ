const express = require("express");
const amqp = require("amqplib/callback_api");
const port = 3000;
const app = express();

app.get("/consumer", (req, res) => {
  amqp.connect("amqp://localhost", (err, conn) => {
    if (err) return console.log("Error in rabbitmq connection: ", err);
    conn.createChannel(async (err, channel) => {
      if (err) return console.log("Error in channel: ", err);

      const queue = "message_queue_publisher";

      await channel.consume(queue, (data) => {
        console.log("Consumed by product queue");
        const response = JSON.parse(data.content);
        channel.ack(data);
        console.log("response", response);
        return res.status(201).json({
          success: true,
          message: response,
        });
      });
    });
  });
});

app.listen(port, "127.0.0.1", () => {
  console.log(`consumer server is listening at port ${port}`);
});
