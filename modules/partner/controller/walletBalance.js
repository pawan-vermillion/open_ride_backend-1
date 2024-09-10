const WalletBalanceService = require("../services/shared/walletBalance");

class WalletBalanceController {
    async getWalletHistory(req, res, next) {
        try {
            const partnerId = req.user.id;
            const { limit, page } = req.query;
           
            let walletHistoryData;
             
                walletHistoryData = await WalletBalanceService.getWalletHistory(
                    partnerId,
                    limit,
                    page
                );

               
                return res.status(201).json(walletHistoryData);
           
        } catch (error) {
            next(error);
        }
    }

    async applyWithdraw(req, res) {
        try {
            const partnerId = req.user.id;  
            const { amount } = req.body;
          
          const result = await WalletBalanceService.applyWithdrawRequest({partnerId, amount});
          res.status(201).json(result);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }

      async getRequestsByPartner(req, res) {
        try {
          const partnerId = req.user.id;
          const { page = 1, limit = 10 } = req.query;
          const requests = await WalletBalanceService.getWithdrawRequestsByPartner({partnerId , page ,limit });
          res.status(200).json(requests);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
}

module.exports = new WalletBalanceController();
