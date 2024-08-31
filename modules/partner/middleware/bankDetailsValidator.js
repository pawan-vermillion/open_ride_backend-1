const { body, validationResult } = require ('express-validator');

const bankDetailsValidationRules = () =>{
    return [
        body('accountHolderName').notEmpty().withMessage('Account holder name is required'),
        body('accountNumber').notEmpty().withMessage('Account number is required'),
        body('bankName').notEmpty().withMessage('Bank name is required'),
        body('branchName').notEmpty().withMessage('Branch name is required'),
        body('ifscCode').notEmpty().withMessage('IFSC code is required'),
      ];
};

const validate = (req,res,next)=>{
    const errors = validationResult(req);
    if(errors.isEmpty()){
        return next();
    }

    const extractedErrors = [];
    errors.array().map(error => extractedErrors.push(error.msg));

    return res.status(422).json({message : extractedErrors[0]});

}


module.exports = {
    bankDetailsValidationRules,
    validate,
}