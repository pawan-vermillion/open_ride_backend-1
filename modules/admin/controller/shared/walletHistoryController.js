const WalletBalanceService = require("../../services/shared/walletHistoryService");
const User = require("../../../user/model/user"); // Assuming you have a User model
const Partner = require("../../../partner/model/partner"); // Assuming you have a Partner model

class WalletBalanceController {
    async getWalletHistory(req, res, next) {
        try {
            const { limit, page } = req.query;
            const { id } = req.params;

            let walletHistoryData;
            
            // First, check if the id is a valid userId
            const user = await User.findById(id);
            if (user) {
                // It's a userId, fetch user's wallet history
                walletHistoryData = await WalletBalanceService.getWalletHistory(id, limit, page, 'user');
            } else {
                // If not found in users, check for partnerId
                const partner = await Partner.findById(id);
                if (partner) {
                    // It's a partnerId, fetch partner's wallet history
                    walletHistoryData = await WalletBalanceService.getWalletHistory(id, limit, page, 'partner');
                } else {
                    // If neither userId nor partnerId is found, return an error
                    return res.status(404).json({ message: "User or Partner not found" });
                }
            }

            return res.status(201).json(walletHistoryData);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new WalletBalanceController();
