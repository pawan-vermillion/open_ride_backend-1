const WalletBalanceService = require("../service/walletBalance");

class WalletBalanceController {
    async getWalletHistory(req, res, next) {
        try {
            const userId = req.user.id;
            const { limit, page } = req.query;
           
            let walletHistoryData;
             
                walletHistoryData = await WalletBalanceService.getWalletHistory(
                    userId,
                    limit,
                    page
                );

               
                return res.status(201).json(walletHistoryData);
           
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new WalletBalanceController();
