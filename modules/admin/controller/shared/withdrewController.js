const WithdrawRequestService = require("../../services/shared/withdrewService")

class WithdrawRequestController{
    async getAllRequests(req,res){
        const { filter, page, limit } = req.query;
    
        try {
          const requests = await WithdrawRequestService.getallWithdrewRequests(
            filter, limit, page
          );
          res.status(200).json(requests);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    }
    async approvedRequest(req, res) {
      try {
        const { requestId } = req.params; 
        
      
        const result = await WithdrawRequestService.approvedRequest(requestId);
        
        
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }

    async rejectRequest(req, res) {
      try {
        const { requestId } = req.params;  
        
        
        const result = await WithdrawRequestService.rejectRequest(requestId);
        
        
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
    
    
}
module.exports = new  WithdrawRequestController();
