const PartnerService = require("../services/shared/partnerService");

class PartnerController {
    getPartner = async (req, res, next) => {
        try {
          const PartnerId = req.user.id;
          const result = await PartnerService.getPartnerById({PartnerId});
          return res.status(200).json(result);
        } catch (error) {
         res.status(404).json({message:error.message})
        }
}
}
module.exports = new PartnerController()