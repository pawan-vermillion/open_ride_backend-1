const { body, validationResult } = require("express-validator");

const withdrawRequestValidationRules = () => {
  return [
    body("amount")
      .notEmpty()
      .withMessage("Amount is required")
      .isNumeric()
      .withMessage("Amount in must be in number"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((error) => extractedErrors.push(error.msg));

  return res.status(422).json({ message: extractedErrors[0] });
};

module.exports = {
withdrawRequestValidationRules,
  validate,
};
