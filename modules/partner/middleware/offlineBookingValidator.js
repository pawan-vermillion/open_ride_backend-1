const { body, validationResult } = require("express-validator");


const OfflineBookingValidationRules = () => {
  return [

    body("username")
      .exists()
      .withMessage("Username is required")
      .notEmpty()
      .withMessage("Username cannot be empty"),


    body("phoneNumber")
      .exists()
      .withMessage("Phone number is required")
      .notEmpty()
      .withMessage("Phone number cannot be empty")
      .isNumeric()
      .withMessage("Phone number must be numeric")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must be 10 digits long"),

  
    body("amount")
      .exists()
      .withMessage("Amount is required")
      .notEmpty()
      .withMessage("Amount cannot be empty")
      .isNumeric()
      .withMessage("Amount must be a number"),


    body("carComapny")
      .exists()
      .withMessage("Car company is required")
      .notEmpty()
      .withMessage("Car company cannot be empty"),

    body("carModel")
      .exists()
      .withMessage("Car model is required")
      .notEmpty()
      .withMessage("Car model cannot be empty"),

   
    body("pickUpDate")
      .exists()
      .withMessage("Pick-up date is required")
      .notEmpty()
      .withMessage("Pick-up date cannot be empty")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Pick-up date must be in the format YYYY-MM-DD"),

    
    body("returnDate")
      .exists()
      .withMessage("Return date is required")
      .notEmpty()
      .withMessage("Return date cannot be empty")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Return date must be in the format YYYY-MM-DD"),
  ];
};


const OfflineBookingvalidate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

 
  const extractedErrors = errors.array().map((error) => error.msg);
  return res.status(422).json({ message: extractedErrors[0] });
};

module.exports = {
  OfflineBookingValidationRules,
  OfflineBookingvalidate,
};
