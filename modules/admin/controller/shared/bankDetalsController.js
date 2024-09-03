const BankDetailsService = require("../../services/shared/bankDetailsService")

class BankDetailsController {
    async updateBankDetails (req,res) {
        try {
            const {partnerId} = req.params;
            const updateBankDetails = await BankDetailsService.updateBankDetails(partnerId , req.body)
            res.status(200).json({message : "Bank details update successfully" })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
   
}
module.exports = new BankDetailsController()