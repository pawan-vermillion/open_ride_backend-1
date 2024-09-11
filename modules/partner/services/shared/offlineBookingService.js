const OfflineBooking = require("../../model/offlineBooking")
const CarDetails = require("../../model/car")
const CarBookingService = require("../../../user/service/carBookingService")
const Partner = require("../../../partner/model/partner")

class OfflineBookingService {
    async createOfflineBooking(bookingData) {
        try {
            const { username, phoneNumber, carId, amount, carComapny, carModel, pickUpDate, returnDate } = bookingData;

            const pickUp = new Date(pickUpDate);
            const returnD = new Date(returnDate);

            const timeDifference = returnD - pickUp;
            const totalHours = timeDifference / (1000 * 60 * 60);

            if (totalHours <= 0) {
                throw new Error("Return date must be later than the pick-up date.");
            }

            const car = await CarDetails.findById(carId);
            if (!car) {
                throw new Error("Car not found.");
            }
            

            const availability = await CarBookingService.checkAvailabilityForRange({
                carId,
                startDate: pickUpDate,
                endDate: returnDate
            });

            if (availability.some(date => !date.isAvailable)) {
                throw new Error("Car is not available for the selected offline booking dates.");
            }
            const newBooking = new OfflineBooking({
                username,
                phoneNumber,
                carId,
                amount,
                carComapny,
                carModel,
                pickUpDate,
                returnDate
            });

            await newBooking.save();
            return {
                message: "New offline booking added successfully",
                totalHours
            };
        } catch (error) {
            throw new Error(error.message || "Error occurred while creating a new offline booking.");
        }
    }
    async getAllOfflineBookings({ limit, page }) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;
    
            const total = await OfflineBooking.countDocuments();
            const bookings = await OfflineBooking.find()
                .skip(skip)
                .limit(pageSize);
    
            return {
                total,
                limit: pageSize,
                page: currentPage,
                bookings
            };
        } catch (error) {
            throw new Error(error.message || "Error occurred while fetching offline bookings.");
        }
    }
    
}



module.exports = new OfflineBookingService();
