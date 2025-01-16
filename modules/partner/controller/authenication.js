const PartnerService = require("../services/shared/partnerService")
const OtpService= require("../../shared/Service/otpService");
const Partner = require("../model/partner");

class PartnerController {

    handleCreatePartner = async(req,res)=>{
        try {
            const { phoneNumber, phoneOtp,emailOtp ,emailAddress} = req.body
           
            if(phoneOtp != 1234){
              return res.status(404).json({message : "PhoneNumber  Otp is not valid"})
            }
            const isOtpValid = await OtpService.verifyOtp(emailOtp, emailAddress)
            if (!isOtpValid) {
                return res.status(400).json({ message: "Invalid OTP" })
            }

            const partnerData = req.body;
    
            const result = await PartnerService.createPartner({partnerData})
    
            await OtpService.removeOtp(phoneNumber)
            return res.status(201).json(result)
    
        } catch (error) {
            res.status(404).json({message : `${error}`})
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
          return res.status(400).json({ message: "PhoneNumber must be a number" });
        }
    
        if (phoneNumber.toString().length !== 10) {
          return res.status(404).json({ message: "PhoneNumber must be 10 digits" });
        }
    
        const token = await Partner.matchPasswordGenerateToken(phoneNumber, password);
    
        res.status(200).json({ message: "Signed in Successfully", token });
      } catch (error) {
        if (
          error.message === "Partner not found" ||
          error.message === "Incorrect Password" ||
          error.message ===
            "Invalid Access, Please check your password and PhoneNumber"
        ) {
          return res.status(501).json({
            error: true,
            message: "Invalid Access, please check your password and phoneNumber",
          });
        }
    
        return res.status(500).json({
          message: "Error logging in User",
          error: error.message,
        });
      }
    };
    
    
}
module.exports = new PartnerController()