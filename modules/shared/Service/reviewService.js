const CarReview = require("../../user/model/review")
const UserReviews = require("../../partner/model/review")

class GetReviewService {
    getReviewsByCarId = async (carId, page, limit) => {
        try {
            const pageSize = parseInt(limit) || 10
            const currentPage = parseInt(page) || 1
            const skip = (currentPage - 1) * pageSize
            const total = await CarReview.countDocuments()

            const review = await CarReview.find({ carId }).skip(skip).limit(pageSize).exec()
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

    getReviewsByUserId = async (userId, page, limit) => {
        try {
            const pageSize = parseInt(limit) || 10
            const currentPage = parseInt(page) || 1
            const skip = (currentPage - 1) * pageSize

            

            const total = await UserReviews.countDocuments({ userId })

            const review = await UserReviews.find({ userId }).skip(skip).limit(pageSize).exec()
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
