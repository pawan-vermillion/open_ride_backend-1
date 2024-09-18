const WalletBalanceService = require("../service/walletBalance");

class WalletBalanceController {
    async getWalletHistory(req, res, next) {
        try {
            const userId = req.user.id;
            const { limit, page } = req.query;

            console.log(`Controller: userId: ${userId}, limit: ${limit}, page: ${page}`);

            let walletHistoryData = await WalletBalanceService.getWalletHistory(
                userId,
                limit,
                page
            );

            console.log(`Controller: Fetched wallet history data:`, walletHistoryData);

            return res.status(201).json(walletHistoryData);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new WalletBalanceController();