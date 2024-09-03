const mongoose = require('mongoose');

const UserReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true
  },
  
  review: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
}, { timestamps: true });

UserReviewSchema.post('save', async function (doc) {
  await mongoose.model('Partner').calculateAverageRating(doc.partnerId);
});

module.exports = mongoose.model('UserReviews', UserReviewSchema);
