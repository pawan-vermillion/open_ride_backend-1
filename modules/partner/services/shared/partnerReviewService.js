const UserReviews = require("../../model/review");
const User = require("../../../user/model/user");

class PartnerReviewService {
    updateReview = async (partnerId, userId, review, rating) => {
        try {
            
            let reviewDocument = await UserReviews.findOne({ partnerId, userId });

            if (!reviewDocument) {
             
                reviewDocument = new UserReviews({
                    userId,
                    partnerId,
                    review,
                    rating
                });
                await reviewDocument.save();
            } else {
             
                reviewDocument.review = review;
                reviewDocument.rating = rating;
                await reviewDocument.save();
            }

            
            await User.findByIdAndUpdate(userId, { rating });

          
            return reviewDocument;
        } catch (error) {
            return { error: error.message };
        }
    }
}





module.exports = new PartnerReviewService();
