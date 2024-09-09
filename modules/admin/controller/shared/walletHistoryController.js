const WalletBalanceService = require("../../services/shared/walletHistoryService");
const User = require("../../../user/model/user");
const Partner = require("../../../partner/model/partner"); 

class WalletBalanceController {
    async getWalletHistory(req, res, next) {
        try {
            const { limit, page } = req.query;
            const { id } = req.params;

            let walletHistoryData;
            
          
            const user = await User.findById(id);
            if (user) {
               
                walletHistoryData = await WalletBalanceService.getWalletHistory(id, limit, page, 'user');
            } else {
               
                const partner = await Partner.findById(id);
                if (partner) {
                    
                    walletHistoryData = await WalletBalanceService.getWalletHistory(id, limit, page, 'partner');
                } else {
                   
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
