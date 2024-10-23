const AdminService = require("../../services/shared/adminService")

const OtpService = require("../../../shared/Service/otpService")
const Admin = require("../../model/admin")


class AuthController {


  handleCreateAdmin = async (req, res) => {
    try {
      const { phoneNumber, phoneOtp, emailOtp, emailAddress } = req.body

      if (phoneOtp != 1234) {
        return res.status(404).json({ message: "PhoneNumber  Otp is not valid" })
      }
      const isOtpValid = await OtpService.verifyOtp(emailOtp, emailAddress)
      if (!isOtpValid) {
        return res.status(400).json({ message: "Invalid OTP" })
      }
      const adminData = req.body;

      const result = await AdminService.createAdmin(adminData)

      await OtpService.removeOtp(phoneNumber)
      return res.status(201).json(result)

    } catch (error) {
      return res.status(404).json({ message: `${error}` })
    }
  }


  handleSignIn = async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;
      if (!phoneNumber || !password) {
        return res
          .status(400)
          .json({ message: "Both phoneNumber and password are required" });
      }
      if (isNaN(phoneNumber)) {
        return res.status(400).json({ message: "PhoneNumber must be number" });
      }

      if (phoneNumber.toString().length !== 10) {
        return res.status(400).json({ message: "PhoneNumber must be 10 digit" });
      }

      const token = await Admin.matchPasswordAndGenerateToken(phoneNumber, password);
      

      res.status(200).json({ message: "Signin in SucessFully", token });

    } 
    catch (error) {
      if (error.message === "Admin not found") {
        return res
          .status(401)
          .json({ message: "Please sign up before accessing your account" });
      } else if (error.message === "Incorrect Password") {
        return res.status(401).json({ message: "Incorrect Password" });
      }
      return res
        .status(500)
        .json({ message: "Error logging in admin", error: error.message });
    }
  }



}
module.exports = new AuthController();