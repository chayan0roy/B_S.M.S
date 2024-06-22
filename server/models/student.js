const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Student = new mongoose.Schema({
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
    whatsappNumber: {
        type: Number
    },
    address: {
        type: String
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
    },
    batchData: [{
        batchName: {
            type: String
        },
        whyLearn: {
            type: String
        },
    }],
    batches: [
        {
            batchID: {
                type: String
            },
            studentRoll: {
                type: Number
            },
            learningPurpus: {
                type: String
            },
            dueFees: {
                type: Number
            },
            paymentHistory: [
                {
                    screenshort: {
                        type: String,
                        required: true
                    },
                    amount: {
                        type: Number,
                        required: true
                    },
                    isApprove: {
                        type: Boolean,
                    }
                }
            ],
            complains: [
                {
                    date: {
                        type: Date
                    },
                    complain: {
                        type: String
                    }
                }
            ]
        }
    ]
})


const Student_Schima = mongoose.model("students", Student);
module.exports = Student_Schima;