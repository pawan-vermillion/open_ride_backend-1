const WalletBalanceService = require("../services/shared/walletBalance");

class WalletBalanceController {
  async getWalletHistory(req, res, next) {
    try {
        const partnerId = req.user.id;
        const { limit, page } = req.query;

        // Get wallet history and withdraw request data
        const walletHistoryData = await WalletBalanceService.getWalletHistory(partnerId, limit, page);

        // Return combined data in the response
        return res.status(200).json(walletHistoryData);
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
          const { page, limit  } = req.query;
          const requests = await WalletBalanceService.getWithdrawRequestsByPartner({partnerId , page ,limit });
          res.status(200).json(requests);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
}

module.exports = new WalletBalanceController();
