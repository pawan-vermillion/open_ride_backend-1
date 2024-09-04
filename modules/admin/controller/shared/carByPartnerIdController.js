const CarGetByPartnerIdService = require("../../services/shared/carByPartnerIdService")

class CarGetByPartnerIdController {
    async getCarsByPartnerId(req, res) {
        try {
            const { partnerId } = req.params;
            const { limit, page } = req.query;
            if (!partnerId) {
                return res.status(400).json({ message: "Partner ID is required" });
            }

            const cars = await CarGetByPartnerIdService.GetCar(partnerId ,limit, page );

            res.status(200).json(cars);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = new  CarGetByPartnerIdController();
