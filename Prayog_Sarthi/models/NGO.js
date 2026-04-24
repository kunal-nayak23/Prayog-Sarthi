const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
    ngoName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contactPersonName: {
        type: String,
        required: true
    },
    contactPersonEmail: {
        type: String,
        required: true
    },
    volunteersNeeded: {
        type: Number,
        default: 0
    },
    categoryOfVolunteers: {
        type: String
    },
    volunteerAgeGroup: {
        type: String
    },
    experienceLevel: {
        type: String
    },
    volunteerDescription: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NGO', ngoSchema);
