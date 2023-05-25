const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingtSchema = new Schema({
    event: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Event'},
    user: {type:mongoose.Schema.Types.ObjectId, required:true},
    checkInDate: Number,
    checkInTime: Number,
    numberGuests: Number,
    finalPrice: Number,
});

const BookingModel = mongoose.model('Booking', BookingtSchema);

module.exports = BookingModel;