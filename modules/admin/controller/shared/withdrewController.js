const WithdrawRequestService = require("../../services/shared/withdrewService")

class WithdrawRequestController{
  async getAllRequests(req, res) {
    const { filter, page, limit } = req.query;
    try {
      const requests = await WithdrawRequestService.getallWithdrewRequests(filter, limit, page);
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  async handleRequest(req, res) {
    try {
      const { requestId } = req.params;
      const { action } = req.body; // 'approve' or 'reject'
  
      if (!['approved', 'rejected'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action' });
      }
  
      let result;
      if (action === 'approved') {
        result = await WithdrawRequestService.approvedRequest(requestId);
      } else if (action === 'rejected') {
        result = await WithdrawRequestService.rejectRequest(requestId);
      }
  
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
    
}
module.exports = new  WithdrawRequestController();
