const WalletBalanceService = require("../services/shared/walletBalance");

class WalletBalanceController {
    async getWalletHistory(req, res, next) {
        try {
            const partnerId = req.user.id;
            const { limit, page } = req.query;

         
            const { userId, transactionType, amount, bookingId } = req.body;

            let walletHistoryData;

        if (userId && transactionType && amount && bookingId) {
            const newEntry = await WalletBalanceService.addWalletHistory(
                    partnerId,
                    userId,
                    transactionType,
                    amount,
                    bookingId
            );

            walletHistoryData = [newEntry];
            } else {
               
                const walletHistoryData = await WalletBalanceService.getWalletHistory(
                    partnerId,
                    limit,
                    page
                );
                console.log('Wallet History Data:', walletHistoryData);
                return res.status(200).json(walletHistoryData); 
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new WalletBalanceController();
