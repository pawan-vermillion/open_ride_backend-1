const {body, validationResult} = require("express-validator")

const favoriteCarValidationRules = () => {
    return[
        body('carId').exists().withMessage("carId is Required")
        .notEmpty()
        .withMessage("carId cannot be empty")
    ];
}


const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
  
    const extractedErrors = errors.array().map(error => error.msg);
    return res.status(422).json({ errors: extractedErrors[0] });
  };
module.exports ={
    favoriteCarValidationRules,
    validate
}
