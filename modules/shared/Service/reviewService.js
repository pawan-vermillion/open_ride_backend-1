const Review = require("../../user/model/review")

class GetReviewService {
    getReviewsByCarId = async (carId, page, limit) => {
        try {
            const pageSize = parseInt(limit) || 10
            const currentPage = parseInt(page) || 1
            const skip = (currentPage - 1) * pageSize
            const total = await Review.countDocuments()

            const review = await Review.find({ carId }).skip(skip).limit(pageSize).exec()
            if (review.length === 0) {
                return { error: "Review not found", statusCode: 404 };
            }
            return {
                page: currentPage,
                limit: pageSize,
                totalReview: total,
                review
            }

        } catch (error) {
            return {
                error: "An error occurred while fetching reviews.",
                statusCode: 500,
            }
        }
    }
}

module.exports = new GetReviewService();
