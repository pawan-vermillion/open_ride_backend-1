const mongoose = require ("mongoose");

const bankDetailsSchema = new mongoose.Schema({
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true,
      },
      accountHolderName: {
        type: String,
        default: '',
      },
      accountNumber: {
        type: String,
        default: '',
      },
      bankName: {
        type: String,
        default: '',
      },
      branchName: {
        type: String,
        default: '',
      },
      ifscCode: {
        type: String,
        default: '',
      }
    });

    const BankDetails = mongoose.model('BankDetails', bankDetailsSchema);

    module.exports = BankDetails;

