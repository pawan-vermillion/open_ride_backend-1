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
    
  },
}, { timestamps: true });

UserReviewSchema.post('save', async function (doc) {
  await mongoose.model('Partner').calculateAverageRating(doc.partnerId);
});

module.exports = mongoose.model('UserReviews', UserReviewSchema);
