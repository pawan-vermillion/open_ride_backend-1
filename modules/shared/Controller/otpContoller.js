const nodemailer = require("nodemailer");
const { storeOtp } = require("../Service/otpService");

exports.sendOTP = async (emailAddress, phoneNumber) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
   
    await storeOtp(phoneNumber, otp);
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.EMAIL_USER,
      to: emailAddress,
      subject: "OpenRide Account Verification",
      text: `Thank you for choosing OpenRide! To complete your account creation, please enter the following One-Time Password (OTP):\n\n${otp}\n\nThis OTP is valid for 5 minutes. For security reasons, do not share this code with anyone.\n\nIf you did not request this OTP, you can safely ignore this message.\n\nWelcome to OpenRide!\n\nSincerely,\nThe OpenRide Team`,
    };

    await transporter.sendMail(mailOption);
    return { message: "OTP sent successfully" };
  } catch (error) {
   
    throw new Error("Failed to send OTP");
  }
};
