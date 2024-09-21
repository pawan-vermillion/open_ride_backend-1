const Partner = require("../../../partner/model/partner")
const BankDetails = require("../../../partner/model/bankDetails")
const WithdrawRequest = require("../../../partner/model/withdrewRequest")
class PartnerService {


    async getPartner({limit, page}) {
        try {
            const pageSize = parseInt(limit) ||10;
            const currentPage = parseInt(page) ||1;
            const skip = (currentPage - 1) * pageSize;
            const total = await Partner.countDocuments()
            const partners = await Partner.find().select("-__v -password -updatedAt").skip(skip)
                .limit(pageSize);



            if (!partners) {
                const error = new Error("Partner not found");
                error.statusCode = 404;
                throw error;
            }

            return {

                page:currentPage,
                limit:pageSize,
                totalPartner:total,
                partners,
            };
        } catch (error) {
            throw error;
        }

    }
    async getPartnerById(PartnerId) {
        try {
            const partner = await Partner.findById(PartnerId).select("-__v -password -updatedAt");

            if (!partner) {
                const error = new Error("Partner not found");
                error.statusCode = 404;
                throw error;
            }


            const bankDetails = await BankDetails.findOne({partnerId:PartnerId});
            
            
            return {
                partnerDetails: partner,  
                bankDetails: bankDetails || {}
            };

        } catch (error) {
            throw error;
        }

    }

  


}
module.exports = new PartnerService();