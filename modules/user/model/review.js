const mongoose = require('mongoose');

const CarReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
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

CarReviewSchema.post('save', async function (doc) {
  await mongoose.model('Car').calculateAverageRating(doc.carId);
});
module.exports = mongoose.model('CarReview', CarReviewSchema);

