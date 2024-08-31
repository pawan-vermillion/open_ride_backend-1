const ReviewService = require("../service/UpdateReviewService")

class ReviewController {
    addOrUpdateReview = async (req, res) => {
        try {
            const {  review, rating } = req.body;
            const userId = req.user.id;
            const carId = req.params.carId;
            const result = await ReviewService.addOrUpdateReview(carId, userId, review, rating)
            if(result.error){
                return res.status(400).json({ message: result.error });
            }

            res.status(200).json({message:"Review successfully add",review:result});
        } catch (error) {
        
            res
                .status(500)
                .json({ error:error.message });
        }
    }
}

module.exports = new  ReviewController();
