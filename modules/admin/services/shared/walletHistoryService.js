const WalletHistory = require("../../../partner/model/walletBalance");

class WalletBalanceService {
    async getWalletHistory(id, limit, page, type) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;
            const query = type === 'user' ? { userId: id } : { partnerId: id }; 
            const total = await WalletHistory.countDocuments(query);
            const walletHistoryData = await WalletHistory.find(query)
                .skip(skip)
                .limit(pageSize);
            
            return {
                page:currentPage,
                limit:pageSize,
                total,
                walletHistoryData,
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new WalletBalanceService();
