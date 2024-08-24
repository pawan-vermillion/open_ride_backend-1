const WalletHistory = require("../../model/walletBalance");

class WalletBalanceService {
    async getWalletHistory(partnerId, limit, page) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;

            console.log(`Fetching wallet history for partnerId: ${partnerId}`); 
            const walletHistoryData = await WalletHistory.find({
                partnerId: partnerId,
            })
            .skip(skip)
            .limit(pageSize);
            
            return walletHistoryData;
        } catch (error) {
            throw error;
        }
    }

    async addWalletHistory(partnerId, userId, transactionType, amount, bookingId) {
        try {
            const walletHistoryEntry = new WalletHistory({
                partnerId,
                userId,
                transactionType,
                amount,
                bookingId,
            });

            const savedEntry = await walletHistoryEntry.save();
            return savedEntry;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new WalletBalanceService();
