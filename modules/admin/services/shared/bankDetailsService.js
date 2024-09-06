const BankDetails = require("../../../partner/model/bankDetails")

class BankDetailsService {
    async updateBankDetails(partnerId, bankDetailsData) {
        try {
          // Find and update or create new bank details
          let bankDetails = await BankDetails.findOneAndUpdate(
            { partnerId },
            {
              $set: {
                accountHolderName: bankDetailsData.accountHolderName,
                accountNumber: bankDetailsData.accountNumber,
                bankName: bankDetailsData.bankName,
                branchName: bankDetailsData.branchName,
                ifscCode: bankDetailsData.ifscCode
              }
            },
            { new: true, upsert: true } // Create the document if it doesn't exist
          );
    
          if (!bankDetails) {
            throw new Error('Bank details not found and could not be created.');
          }
    
          const response = bankDetails.toObject();
          delete response.__v;
    
          return response;
        } catch (error) {
          throw error;
        }
      }
   

  
}

module.exports = new BankDetailsService();
