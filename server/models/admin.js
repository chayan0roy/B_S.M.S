const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Admin = new mongoose.Schema({
    profileIMG: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    role: {
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
    }
})


const Admin_Schima = mongoose.model("admins", Admin);
module.exports = Admin_Schima;
