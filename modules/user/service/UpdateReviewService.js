const CarReview = require("../model/review");
const CarDetails = require("../../partner/model/car");

class ReviewService {
    addOrUpdateReview = async (carId, userId, review, rating) => {
        try {
            let reviewDocument = await CarReview.findOne({ carId, userId });

          
                reviewDocument = new CarReview({
                    userId,
                    carId,
                    review,
                    rating
                });
                await reviewDocument.save();
            

            await CarDetails.calculateAverageRating(carId); // Ensure this method updates the car's rating
            return reviewDocument;
        } catch (error) {
            return { error: error.message };
        }
    }
}

module.exports = new ReviewService();
