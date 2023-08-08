const express = require("express");
const amqp = require("amqplib/callback_api");
const port = 3001;
const app = express();

app.get("/publisher", (req, res) => {
  //data to be publish
  const data = {
    id: 1,
    name: "xyz",
    age: 20,
  };
  //connect with rabbitmq
  amqp.connect("amqp://localhost", (err, conn) => {
    if (err) return console.log("Error in rabbitmq connection: ", err);
    //if connection then create channel in rabbitmq
    conn.createChannel(async (err, ch) => {
        if(err) return console.log('Error in channel: ', err);
      // create queue name
      const queue = "message_queue_publisher";
      // stringify data as message
      const msg = JSON.stringify(data);
      // insert queque to the created channel
      await ch.assertQueue(queue, { durable: false });
      //send msg to the queue
      await ch.sendToQueue(queue, Buffer.from(msg));
      console.log(`Message (${msg}) sent to the queue (${queue})`);
    });
  });
  res.send("Message from the publisher side");
  
});

app.listen(port, "127.0.0.1", () => {
  console.log(`publisher server is listening at port ${port}`);
});
