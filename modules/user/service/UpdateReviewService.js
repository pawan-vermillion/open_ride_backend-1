const CarReview = require("../model/review")
const  carDetails = require("../../partner/model/car")


class ReviewService {
    addOrUpdateReview = async (carId, userId, review, rating) => {
        try {
            let reviewDocument = await CarReview.findOne({ carId, userId });

            if (!reviewDocument) {
               
                reviewDocument = new CarReview({
                    userId,
                    carId,
                    review,
                    rating
                });
                await reviewDocument.save();
            } else {
               
                reviewDocument.review = review; 
                reviewDocument.rating = rating; 
                await reviewDocument.save();
            }

            await carDetails.calculateAverageRating(carId);
            return reviewDocument;
        } catch (error) {
           
            return { error: error.message };
        }
    }
}

module.exports = new ReviewService()