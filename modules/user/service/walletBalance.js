const mongoose = require('mongoose');
const WalletBalance = require("../model/walletBalance");

class WalletBalanceService {
    async getWalletHistory(userId, limit, page) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;

            console.log(`Fetching wallet history for userId: ${userId}, limit: ${limit}, page: ${page}`);

            const total = await WalletBalance.countDocuments({ userId: new mongoose.Types.ObjectId(userId) });

            console.log(`Total documents found: ${total}`);

            const walletHistoryData = await WalletBalance.find({ userId: new mongoose.Types.ObjectId(userId) })
                .skip(skip)
                .limit(pageSize);

            console.log(`Fetched ${walletHistoryData.length} records`);

            return {
                page,
                limit,
                total,
                walletHistoryData
            };
        } catch (error) {
            console.error(`Error fetching wallet history: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new WalletBalanceService();