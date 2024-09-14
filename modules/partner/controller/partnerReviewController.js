const PartnerReviewService = require("../services/shared/partnerReviewService");

class PartnerReviewController {
    upadteReview = async (req, res) => {
        try {
            const { review, rating } = req.body;
            const userId = req.params.userId;
            const partnerId = req.user.id;

            // Update the review in the service
            const result = await PartnerReviewService.updateReview(partnerId, userId, review, rating);

            if (result.error) {
                return res.status(400).json({ message: result.error });
            }

            // Send only the submitted review and rating
            res.status(200).json({
                message: "Review successfully added",
                review: result  // Return the submitted review and rating
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PartnerReviewController();
