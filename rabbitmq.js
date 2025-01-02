const amqp = require("amqplib");
const nodemailer = require('nodemailer');

let channel = null;
let connection = null;

const connectRabbitMq = async () => {
  let retries = 5; 
  while (retries > 0) {
    try {
      connection = await amqp.connect("amqp://localhost:5673");
      channel = await connection.createChannel();
      await channel.assertQueue("otpQueue", { durable: true });
      console.log("RabbitMQ connected and queue asserted");

      
      consumeOtpQueue();

      return channel; 
    } catch (error) {
      retries -= 1;
      console.error(`Error connecting to RabbitMQ, retries left: ${retries}`, error);
      if (retries === 0) {
        console.error("Failed to connect to RabbitMQ after multiple attempts");
        process.exit(1); 
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); 
    }
  }
};


const consumeOtpQueue = async () => {
  if (!channel) {
    console.error("RabbitMQ channel is not available");
    return;
  }

  channel.consume("otpQueue", async (msg) => {
    if (msg) {
      

      const otpData = JSON.parse(msg.content.toString());
      const { emailAddress, otp } = otpData;


      const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
    port: 465,
    secure: true, 
    auth: {
      user: "otp@trennd.in",
      pass: "Bhargav@2121",
    },
    tls: {
      rejectUnauthorized: false,
    },
      });

      const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: emailAddress,
        subject: "OpenRide Account Verification",
        html: `
          <div style="font-size: 16px;">
            Thank you for choosing OpenRide! To complete your account creation, please enter the following One-Time Password (OTP):
            <br><br>
            <strong style="font-size: 25px;">${otp}</strong>
            <br><br>
            This OTP is valid for 5 minutes. For security reasons, do not share this code with anyone.
            <br><br>
            If you did not request this OTP, you can safely ignore this message.
            <br><br>
            Welcome to OpenRide!
            <br><br>
            Sincerely,
            <br>The OpenRide Team
          </div>
        `,
      };

     
      try {
        await transporter.sendMail(mailOptions);
       
      } catch (emailError) {
        console.error("Error sending OTP email:", emailError);
      }

      
      channel.ack(msg);
    } else {
      console.error("Received empty message, skipping...");
    }
  });
};

const sendOtpToQueue = async (otp) => {
  if (!channel) {
    console.error("RabbitMQ channel is not available");
    return;
  }
  const message = JSON.stringify(otp);
  channel.sendToQueue("otpQueue", Buffer.from(message), { persistent: true });
 
};

process.on("SIGINT", async () => {
  console.log("Shutting down...");
  if (channel) {
    try {
      await channel.close();
      console.log("RabbitMQ channel closed");
    } catch (error) {
      console.error("Error closing RabbitMQ channel:", error);
    }
  }
  if (connection) {
    try {
      await connection.close();
      console.log("RabbitMQ connection closed");
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
    }
  }
  process.exit(0); 
});

module.exports = { connectRabbitMq, sendOtpToQueue };
