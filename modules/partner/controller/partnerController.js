const PartnerService = require("../services/shared/partnerService");

class PartnerController {
    getPartner = async (req, res, next) => {
        try {
          const PartnerId = req.user.id;
          const result = await PartnerService.getUserById({PartnerId});
          return res.status(200).json(result);
        } catch (error) {
          throw error;
        }
}
}
module.exports = new PartnerController()