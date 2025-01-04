
const { body, validationResult } = require('express-validator');

const summaryValidationRules = ()=>{
    return[

    body('pickUpDate')
        .isString()
        .withMessage('Pick-up date is required.'),
    body('pickUpTime')
        .isString()
        .withMessage('Pick-up time is required.'),
    body('pickupLocation')
        .isString()
        .withMessage('Pick-up location is required.'),
    body('returnDate')
        .isString()
        .withMessage('Return Date is required.'),
    body('returnTime')
        .isString()
        .withMessage('Return Time is required.'),




    
];
}
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = errors.array().map(error => error.msg);
    return res.status(422).json({ message: extractedErrors[0] });
};
module.exports = {
    summaryValidationRules,
    validate
}