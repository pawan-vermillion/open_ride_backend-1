const WalletHistory = require("../../model/walletBalance");

class WalletBalanceService {
    async getWalletHistory(partnerId, limit, page) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;
            const total = await WalletHistory.countDocuments()
            
            const walletHistoryData = await WalletHistory.find({
                partnerId: partnerId,
            })
            .skip(skip)
            .limit(pageSize);
            
            return {
                pageSize,
                currentPage,
                total,
                walletHistoryData
            };
        } catch (error) {
            throw error;
        }
    }

  
}

module.exports = new WalletBalanceService();
