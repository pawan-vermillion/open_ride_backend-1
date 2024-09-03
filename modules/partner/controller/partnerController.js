const PartnerService = require("../services/shared/partnerService");


class PartnerController {
  getPartners = async (req, res, next) => {
    try {
      const PartnerId = req.user.id;
      const { limit, page } = req.query;
      const result = await PartnerService.getPartners({ PartnerId , limit ,page  });
     
      
      return res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
}
  updatePartner = async (req, res) => {
    try {
      const PartnerId = req.user.id;
      const partnerData = req.body
      
      if (req.file) {
        partnerData.profileImage = req.file.path;
      }

      const result = await PartnerService.updatePartner(partnerData, PartnerId)
      return res.status(201).json({
        message: 'Update Successfully',
      
        result
      })

    } catch (error) {
      return res.status(404).json({ message: error.message })
    }
  }
}
module.exports = new PartnerController()