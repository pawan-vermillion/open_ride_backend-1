const GetReviewService = require("../Service/reviewService");

class GetReviewController {
    getReviewsByCarId = async (req, res) => {
        try {
            const { page, limit } = req.query;
            const { carId } = req.params;
            const result = await GetReviewService.getReviewsByCarId(carId, page, limit);
    
            if (result.statusCode === 404) {
                return res.status(404).json({ message: result.error });
            }
    
            if (result.statusCode === 500) {
                return res.status(500).json({ message: result.error });
            }
    
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while processing your request.' });
        }
    }

    getReviewsByUserId = async (req, res) => {
        try {
            const { page, limit } = req.query;
            const { userId } = req.params;
        
            const result = await GetReviewService.getReviewsByUserId(userId, page, limit);
    
            if (result.statusCode === 404) {
                return res.status(404).json({ message: result.error });
            }
    
           
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while processing your request.' });
        }
    }
}


module.exports = new GetReviewController();
