const User = require('../../user/model/user')
const Admin = require('../../admin/model/admin')
const Partner = require('../../partner/model/partner')
const nodemailer = require("nodemailer");


class OtpService {

  constructor() {
    this.otpStore = {};
  }

  async storeOtp(key, otp) {
    this.otpStore[key] = otp; 
    setTimeout(() => {
      delete this.otpStore[key];
    }, 300000);
  }

  async getStoredOtp(key) {
    return this.otpStore[key];
  }

  async verifyOtp(otp, key) {
    const storedOtp = await this.getStoredOtp(key);

    return storedOtp === otp;
  }


  async removeOtp(key) {
    delete this.otpStore[key];
  }

  sendOtp = async ({ emailAddress, userType, isForgot }) => {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      // const key = emailAddress || phoneNumber;
      const key = emailAddress;
      let Model;

      if (userType === "User") {
        Model = User;
      } else if (userType === "Partner") {
        Model = Partner;
      } else if (userType === "Admin") {
        Model = Admin;
      } else {
        throw new Error("Invalid user type");
      }

      const existingEntity = await Model.findOne({
        $or: [{ emailAddress }],
      });

      if (!isForgot) {
        if (existingEntity) {
          return {
            status: 400,
            message: existingEntity.emailAddress === emailAddress
              ? "Email Already Exists"
              : "PhoneNumber Already Exists",
          };
        }
      } else {

        if (!existingEntity) {
          return {
            status: 404,
            message: `${userType} Not Found with the given Email`,
          };
        }

      }


      await this.storeOtp(key, otp);


      if (emailAddress) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
          },
        });

        const mailOption = {
          from: process.env.EMAIL_USER,
          to: emailAddress,
          subject: "OpenRide Account Verification",
          // text: `Thank you for choosing OpenRide! To complete your account creation, please enter the following One-Time Password (OTP):\n\n${otp}\n\nThis OTP is valid for 5 minutes. For security reasons, do not share this code with anyone.\n\nIf you did not request this OTP, you can safely ignore this message.\n\nWelcome to OpenRide!\n\nSincerely,\nThe OpenRide Team`,
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

        await transporter.sendMail(mailOption);
      }

      return { message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error in sendOtp:', error);
      throw new Error(`Failed to send OTP: ${error.message}`);
    }

  }

}

module.exports = new OtpService();






























// = = = = = = = = = = =  = =  = = = = =
// const User = require('../../user/model/user')
// const Admin = require('../../admin/model/admin')
// const Partner = require('../../partner/model/partner')
// const nodemailer = require("nodemailer");


// const otpStore = {};
// const storeOtp = async (mobileNumber, otp) => {
//   otpStore[mobileNumber] = otp;

//   setTimeout(() => {
//     delete otpStore[mobileNumber];

//   }, 300000); // 5 minutes in milliseconds
// };

// const getStoredOtp = async (mobileNumber) => {
//   const otp = otpStore[mobileNumber];

//   return otp;
// };

// const verifyOtp = async (otp, mobileNumber) => {
//   const storedOtp = await getStoredOtp(mobileNumber);

//   return storedOtp === otp;
// };

// const removeOtp = async (mobileNumber) => {
//   delete otpStore[mobileNumber];

// };


// const sendOtp = async ({ emailAddress, userType, isForgot }) => {
//   try {
//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     // const key = emailAddress || phoneNumber;
//     const key = emailAddress;
//     let Model;

//     if (userType === "User") {
//       Model = User;
//     } else if (userType === "Partner") {
//       Model = Partner;
//     } else if (userType === "Admin") {
//       Model = Admin;
//     } else {
//       throw new Error("Invalid user type");
//     }

//     const existingEntity = await Model.findOne({
//       $or: [{ emailAddress }],
//     });

//     if (!isForgot) {
//       if (existingEntity) {
//         return {
//           status: 400,
//           message: existingEntity.emailAddress === emailAddress
//             ? "Email Already Exists"
//             : "PhoneNumber Already Exists",
//         };
//       }
//     } else {

//       if (!existingEntity) {
//         return {
//           status: 404,
//           message: `${userType} Not Found with the given Email`,
//         };
//       }

//     }


//     await this.storeOtp(key, otp);


//     if (emailAddress) {
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: process.env.MAIL_USERNAME,
//           pass: process.env.MAIL_PASSWORD,
//         },
//       });

//       const mailOption = {
//         from: process.env.EMAIL_USER,
//         to: emailAddress,
//         subject: "OpenRide Account Verification",
//         text: `Thank you for choosing OpenRide! To complete your account creation, please enter the following One-Time Password (OTP):\n\n${otp}\n\nThis OTP is valid for 5 minutes. For security reasons, do not share this code with anyone.\n\nIf you did not request this OTP, you can safely ignore this message.\n\nWelcome to OpenRide!\n\nSincerely,\nThe OpenRide Team`,
//       };

//       await transporter.sendMail(mailOption);
//     }

//     return { message: 'OTP sent successfully' };
//   } catch (error) {
//     console.error('Error in sendOtp:', error);
//     throw new Error(`Failed to send OTP: ${error.message}`);
//   }

// }





// module.exports = {
//   storeOtp,
//   verifyOtp,
//   removeOtp,
//   sendOtp
// };
