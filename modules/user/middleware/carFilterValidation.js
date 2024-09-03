const { body, validationResult } = require('express-validator');

const carFilterValidationRules = () => {
  return [
    body('minimumPrice')
      .exists()
      .withMessage('Minimum price is required')
      .isNumeric()
      .withMessage('Minimum price must be a number')
      .custom(value => value >= 0)
      .withMessage('Minimum price must be non-negative'),
    body('maximumPrice')
      .exists()
      .withMessage('Maximum price is required')
      .isNumeric()
      .withMessage('Maximum price must be a number')
      .custom(value => value >= 0)
      .withMessage('Maximum price must be non-negative'),
    body('fuelType')
      .exists()
      .withMessage('Fuel type is required')
      .isIn(['Diesel', 'Petrol', 'CNG', 'Electric'])
      .withMessage('Invalid fuel type'),
    body('transmission')
      .exists()
      .withMessage('Transmission is required')
      .isIn(['Automatic', 'Manual'])
      .withMessage('Invalid transmission type'),
  ];
};

const validateCarFilter = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map(error => error.msg);
  return res.status(422).json({ errors: extractedErrors });
};

module.exports = {
  carFilterValidationRules,
  validateCarFilter,
};
