const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
}, { timestamps: true });

reviewSchema.post('save', async function (doc) {
  await mongoose.model('Car').calculateAverageRating(doc.carId);
});

module.exports = mongoose.model('Review', reviewSchema);

