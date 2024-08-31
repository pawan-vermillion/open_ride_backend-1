const BankDetailsService = require("../services/shared/bankDetails")

class BankDetailsController {
    async updateBankDetails (req,res) {
        try {
            const partnerId = req.user.id;
            const updateBankDetails = await BankDetailsService.updateBankDetails(partnerId , req.body)
            res.status(200).json({message : "Bank details update successfully" })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getBankDetails(req, res) {
        try {
            const partnerId = req.user.id; 
            const bankDetails = await BankDetailsService.getBankDetails(partnerId);
    
            if (!bankDetails) {
                return res.status(404).json({ message: "Bank details not found" });
            }
            res.status(200).json(bankDetails);
    
        } catch (error) {
           
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
module.exports = new BankDetailsController()