const mongoose = require('mongoose');
const WalletBalance = require("../model/walletBalance");

class WalletBalanceService {
    async getWalletHistory(userId, limit, page) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;


            const total = await WalletBalance.countDocuments({ userId: new mongoose.Types.ObjectId(userId) });


            const walletHistoryData = await WalletBalance.find({ userId: new mongoose.Types.ObjectId(userId) })
                .skip(skip)
                .limit(pageSize);


            return  walletHistoryData;
        } catch (error) {
            console.error(`Error fetching wallet history: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new WalletBalanceService();