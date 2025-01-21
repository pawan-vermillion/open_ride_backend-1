const WalletBalanceService = require("../service/walletBalance");

class WalletBalanceController {
    async getWalletHistory(req, res, next) {
        try {
            const userId = req.user.id;
            const { limit, page } = req.query;


            let walletHistoryData = await WalletBalanceService.getWalletHistory(
                userId,
                limit,
                page
            );


            return res.status(200).json(walletHistoryData);
        } catch (error) {
            res.status(500).json({
                error: error.message
            })
        }
    }
}

module.exports = new WalletBalanceController();