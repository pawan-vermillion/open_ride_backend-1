const ReviewService = require("../service/UpdateReviewService");

class UserReviewController {
    addOrUpdateReview = async (req, res) => {
        try {
            const { review, rating } = req.body;
            const userId = req.user.id; // Ensure `req.user` contains the user info
            const carId = req.params.carId;
            
            const result = await ReviewService.addOrUpdateReview(carId, userId, review, rating);
            
            if (result.error) {
                return res.status(400).json({ message: result.error });
            }

            res.status(200).json({ message: "Review successfully added", review: result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UserReviewController();
