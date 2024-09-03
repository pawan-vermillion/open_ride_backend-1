const { body, validationResult } = require('express-validator');

const reviewValidationRules = () => {
  return [
    body('review')
      .exists()
      .withMessage('Review content is required')
      .notEmpty()
      .withMessage('Review content cannot be empty'),
    body('rating')
      .exists()
      .withMessage('Rating is required')
      .notEmpty()
      .withMessage('Rating cannot be empty')
      .isInt({ min: 1, max: 5 }) 
      .withMessage('Rating must be between 1 and 5'),
  ];
};

const validateReview = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map(error => error.msg);
  return res.status(422).json({ errors: extractedErrors[0] });
};

module.exports = {
  reviewValidationRules,
  validateReview,
};