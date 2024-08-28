
const { body, validationResult } = require('express-validator');

const summaryValidationRules = ()=>{
    return[

    body('pickUpData.pickUpDate')
        .isString()
        .withMessage('Pick-up date is required.'),
    body('pickUpData.pickUpTime')
        .isString()
        .withMessage('Pick-up time is required.'),
    body('pickUpData.pickUpLocation')
        .isString()
        .withMessage('Pick-up location is required.'),
    body('pickUpData.pickUpLatitude')
        .isString()
        .withMessage('Pick-up latitude is required.'),
    body('pickUpData.pickUpLongitude')
        .isString()
        .withMessage('Pick-up longitude is required.'),


    body('returnData.returnDate')
        .isString()
        .withMessage('Return date is required.'),
    body('returnData.returnTime')
        .isString()
        .withMessage('Return time is required.'),
    body('returnData.returnLocation')
        .isString()
        .withMessage('Return location is required.'),
    body('returnData.returnLatitude')
        .isString()
        .withMessage('Return latitude is required.'),
    body('returnData.returnLongitude')
        .isString()
        .withMessage('Return longitude is required.'),


   

    
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