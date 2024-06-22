const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { text } = require('express');

const Mentor = new mongoose.Schema({
    profileIMG: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number
    },
    role: {
        type: String,
    },
    subject: {
        type: String,
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    is_verified: {
        type: Boolean
    },
    batches: [{
        batchID: {
            type: String
        }
    }]
})



const Mentor_Schima = mongoose.model("mentors", Mentor);
module.exports = Mentor_Schima;
