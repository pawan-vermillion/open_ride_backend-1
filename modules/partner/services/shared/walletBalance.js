const { default: mongoose } = require("mongoose");
const WalletHistory = require("../../model/walletHistory");
const WithdrawRequest = require("../../model/withdrewRequest");
const Partner = require("../../model/partner");
const walletHistory = require("../../model/walletHistory");
require("dotenv").config();

class WalletBalanceService {
    async getWalletHistory(partnerId, limit, page) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;
    
          
            const walletHistoryData = await WalletHistory.find({ partnerId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize);
    
          
            const withdrawRequestData = await WithdrawRequest.find({ partnerId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize);
    
       
            const combinedData = [...walletHistoryData, ...withdrawRequestData];
    
           
            combinedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
          
            const formattedData = combinedData.map(item => ({
                ...item._doc,
                createdAt: new Date(item.createdAt).toISOString().split('T')[0],
                updatedAt: new Date(item.updatedAt).toISOString().split('T')[0],
            }));
    
            
            const total = await WalletHistory.countDocuments({ partnerId }) + await WithdrawRequest.countDocuments({ partnerId });
    
            return  formattedData;
        } catch (error) {
            console.error(`Error fetching wallet history: ${error.message}`);
            throw error;
        }
    }
    
    
    
    async applyWithdrawRequest({ partnerId, amount }) {
        const session = await mongoose.startSession(); 
    
        try {
            session.startTransaction();
    
           
            const existingRequest = await walletHistory.findOne({
                partnerId,
                status: "Pending",
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
    
            
            const withdrawRequest = new walletHistory({
                partnerId,
                amount,
                transactionType:"Withdraw",
                UiType:"Withdraw",
                status: "Pending",
                isWithdrewble:false
            });
    
            await withdrawRequest.save({ session });
    
        
            // partner.walletBalance -= amount;
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
      

          const withdrawRequests = await walletHistory.find({ partnerId })
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
            console.log(error)
          throw error;
        }
      }
      



}

module.exports = new WalletBalanceService();
