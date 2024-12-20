const { default: mongoose } = require("mongoose");
const WalletHistory = require("../../model/walletHistory");
const WithdrawRequest = require("../../model/withdrewRequest");
const Partner = require("../../model/partner")
require("dotenv").config();

class WalletBalanceService {
    async getWalletHistory(partnerId, limit, page) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;
    
          
            const walletHistoryData = await WalletHistory.find({ partnerId })
                .skip(skip)
                .limit(pageSize)
                .sort({ createdAt: -1 }); 
    
            const withdrawRequestData = await WithdrawRequest.find({ partnerId })
                .skip(skip)
                .limit(pageSize)
                .sort({ createdAt: -1 });
    
            const combinedData = [...walletHistoryData, ...withdrawRequestData];
    

            combinedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    
            const total = await WalletHistory.countDocuments({ partnerId }) + await WithdrawRequest.countDocuments({ partnerId });
    
            return   combinedData; // Return the merged data
           
        } catch (error) {
            throw error;
        }
    }
    
    
    async applyWithdrawRequest({ partnerId, amount }) {
        const session = await mongoose.startSession(); 
    
        try {
            session.startTransaction();
    
           
            const existingRequest = await WithdrawRequest.findOne({
                partnerId,
                status: "pending",
            }).session(session);
    
            if (existingRequest) {
                throw new Error("You already have a pending withdrawal request");
            }
    
            
            const partner = await Partner.findOne({ _id: partnerId }).session(session);
            if (!partner) {
                throw new Error("Partner not found");
            }
    
            const walletBalance = partner.walletBalance;
    
    
            if (walletBalance < amount) {
                throw new Error("Insufficient balance");
            }
    
            
            const withdrawRequest = new WithdrawRequest({
                partnerId,
                amount,
                status: "pending",
            });
    
            await withdrawRequest.save({ session });
    
        
            partner.walletBalance -= amount;
            await partner.save({ session });
    
            await session.commitTransaction();
            session.endSession();
    
            return withdrawRequest;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
    async getWithdrawRequestsByPartner({ partnerId, page = 1, limit = 10 }) {
        try {
           
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;
      
          const total = await WithdrawRequest.countDocuments({ partnerId });
      

          const withdrawRequests = await WithdrawRequest.find({ partnerId })
            .skip(skip)
            .limit(limit)
            .exec();
      
          return {
            page:currentPage,
            limit:pageSize,
            totalPartner:total,
            withdrawRequests
          };
        } catch (error) {
          throw error;
        }
      }
      



}

module.exports = new WalletBalanceService();
