const PartnerService = require("../services/shared/partnerService")
const{verifyOtp , removeOtp} = require("../../shared/Service/otpService");
const Partner = require("../model/partner");

class PartnerController {

    handleCreatePartner = async(req,res)=>{
        try {
            const { phoneNumber, phoneOtp,emailOtp } = req.body
           
            if(phoneOtp == 123456){
              return res.status(404).json({message : "PhoneNumber  Otp is not valid"})
            }
            const isOtpValid = await verifyOtp(emailOtp, phoneNumber)
            if (!isOtpValid) {
                return res.status(400).json({ message: "Invalid OTP" })
            }

            const partnerData = req.body;
    
            const result = await PartnerService.createPartner({partnerData})
    
            await removeOtp(phoneNumber)
            return res.status(201).json(result)
    
        } catch (error) {
            res.status(404).json({message : `${error}`})
        }
    }

    handleSignIn = async (req,res) => {
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
        
            const token = await Partner.matchPasswordGenerateToken(phoneNumber, password);
        
            res.status(200).json({ message: "Signin in SucessFully", token});
          } catch (error) {
            if (error.message === "Partner not found") {
              return res
                .status(401)
                .json({ message: "Please sign up before accessing your account" });
            } else if (error.message === "Incorrect Password") {
              return res.status(401).json({ message: "Incorrect Password" });
            }
            return res
              .status(500)
              .json({ message: "Error logging in User", error: error.message });
          }
      
}
}
module.exports = new PartnerController()