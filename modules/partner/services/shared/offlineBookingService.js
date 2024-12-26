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
    
            // Check if the provided dates are in the past
            const currentDate = new Date();
            if (pickUp < currentDate || returnD < currentDate) {
                return { message: "Pick-up date or return date cannot be in the past." };
            }
    
            const timeDifference = returnD - pickUp;
            const totalHours = timeDifference / (1000 * 60 * 60);
    
            // Check if return date is later than the pick-up date
            if (totalHours <= 0) {
                return { message: "Return date must be later than the pick-up date." };
            }
    
            const car = await CarDetails.findById(carId);
            if (!car) {
                return { message: "Car not found." };
            }
    
            const availability = await CarBookingService.checkAvailabilityForRange({
                carId,
                startDate: pickUpDate,
                endDate: returnDate
            });
    
            if (availability.some(date => !date.isAvailable)) {
                return { message: "Car is not available for the selected offline booking dates."
                    
                 };
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
                totalHours,
                status: 200
            };
        } catch (error) {
            // Catch unexpected server errors and return 500
            return { message: error.message || "Error occurred while creating a new offline booking.", status: 500 };
        }
    }
    
    


    async getAllOfflineBookings({ partnerId, limit, page }) {
        try {
            const pageSize = parseInt(limit) || 10;
            const currentPage = parseInt(page) || 1;
            const skip = (currentPage - 1) * pageSize;
    
            const total = await OfflineBooking.countDocuments({ partnerId });
            const bookings = await OfflineBooking.find({ partnerId })
                .skip(skip)
                .limit(pageSize);
    
            return bookings; 
        } catch (error) {
            throw new Error(error.message || "Error occurred while fetching offline bookings.");
        }
    }
    
}



module.exports = new OfflineBookingService();
