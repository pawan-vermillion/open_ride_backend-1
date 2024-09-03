const BankDetails = require("../../../partner/model/bankDetails")

class BankDetailsService {
    async updateBankDetails(partnerId, bankDetailsData) {
        try {
            let bankDetails = await BankDetails.findOne({ partnerId })
            if (!bankDetails) {
                throw new Error('Bank details not found.');
            }

            bankDetails = new BankDetails({ partnerId })
            bankDetails.accountHolderName = bankDetailsData.accountHolderName;
            bankDetails.accountNumber = bankDetailsData.accountNumber;
            bankDetails.bankName = bankDetailsData.bankName;
            bankDetails.branchName = bankDetailsData.branchName;
            bankDetails.ifscCode = bankDetailsData.ifscCode;
            await bankDetails.save()

            const response = bankDetails.toObject();
            delete response.__v;

            return response;
        } catch (error) {
            throw error;
        }
    }
  
}

module.exports = new BankDetailsService();
