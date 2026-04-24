const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
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
    disability: {
        type: [String],
        required: true
    },
    disabilityDetails: {
        type: String
    },
    skills: {
        type: [String],
        required: true
    },
    skillsDescription: {
        type: String
    },
    challenges: {
        type: [String]
    },
    supportNeeds: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        required: true
    },
    preferredTime: {
        type: String,
        required: true
    },
    motivation: {
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

module.exports = mongoose.model('Volunteer', volunteerSchema);
