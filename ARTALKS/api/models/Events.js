const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    info: String,
    checkInDate: Number,
    checkInTime: Number,
    maxGuests: Number,
    price: Number,
});

const EventModel = mongoose.model('Event', EventSchema);

module.exports = EventModel;